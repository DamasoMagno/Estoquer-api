import { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "../prisma";

export async function OrderController(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const orderSchemaBody = z.object({
      title: z.string(),
      origin: z.enum(["Supplier", "Client"]),
      category: z.enum(["Input", "Output"]),
      user_id: z.string(),
      deadline: z.date(),
    });

    try {
      const { title, category, origin, deadline, user_id } =
        orderSchemaBody.parse(req.body);

      if (origin === "Supplier" && category !== "Input") {
        return res
          .status(500)
          .send({ error: "Category or Origin is incorrect" });
      }

      await prisma.order.create({
        data: {
          title,
          category,
          origin,
          user_id,
          deadline,
        },
      });

      return res.status(201).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.patch("/:orderId", async (req, res) => {
    const orderSchemaBody = z.object({
      title: z.string().optional(),
      origin: z.enum(["Supplier", "Client"]).optional(),
      category: z.enum(["Input", "Output"]).optional(),
      user_id: z.string().uuid(),
      deadline: z.date().optional(),
    });
    const orderIdSchema = z.object({
      orderId: z.string(),
    });

    try {
      const order = orderSchemaBody.parse(req.body);
      const { orderId } = orderIdSchema.parse(req.params);

      if (order.origin === "Supplier" && order.category !== "Input") {
        return res
          .status(500)
          .send({ error: "Category or Origin is incorrect" });
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          ...order,
        },
      });

      return res.status(201).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.delete("/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      await prisma.order.delete({
        where: {
          id: orderId,
        },
      });

      return res.status(201).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/order", async () => {
    const orders = await prisma.order.findMany();

    return orders;
  });
}

import { FastifyInstance } from "fastify";

import { z } from "zod";

import prisma from "../prisma";
import { AuthenticateUser } from "../middlewares/Authenticate";

export async function OrderController(app: FastifyInstance) {
  app.addHook("preHandler", AuthenticateUser);

  // /order
  app.post("/", async (req, res) => {
    const orderSchemaBody = z.object({
      title: z.string(),
      origin: z.enum(["Supplier", "Client"]),
      type: z.enum(["Input", "Output"]),
      deadline: z.date().optional(),
    });

    try {
      const { title, type, origin, deadline } = orderSchemaBody.parse(req.body);

      if (origin === "Supplier" && type !== "Input") {
        return res
          .status(500)
          .send({ error: "Category or Origin is incorrect" });
      }

      await prisma.order.create({
        data: {
          title,
          type,
          origin,
          user_id: req.user.id,
          deadline: deadline ? deadline : new Date(),
        },
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId
  app.patch("/:orderId", async (req, res) => {
    const orderSchemaBody = z.object({
      title: z.string().optional(),
      origin: z.enum(["Supplier", "Client"]).optional(),
      category: z.enum(["Input", "Output"]).optional(),
      deadline: z.date().optional(),
      finished: z.boolean().optional(),
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

      const orderIsFinished = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (orderIsFinished?.finished) {
        return res.status(500).send({ error: "This order finished" });
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: order,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId
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

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/orders = Orders
  app.get("/orders", async (req, res) => {
    const orderFiltersSchema = z.object({
      title: z.string().optional(),
      type: z.enum(["Input", "Output"]).optional(),
    });

    try {
      const { title, type } = orderFiltersSchema.parse(req.query);

      const orders = await prisma.order.findMany({
        where: {
          user_id: req.user.id,
          title,
          type,
        },
        orderBy: {
          finished: "asc",
        },
        include: {
          items: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
            },
          },
        },
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId = Order
  app.get("/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      const orders = await prisma.order.findMany({
        where: {
          id: orderId,
        },
        include: {
          items: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
            },
          },
        },
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

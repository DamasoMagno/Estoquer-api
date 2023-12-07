import { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "../prisma";
import { AuthenticateUser } from "../middlewares/Authenticate";

export async function OrderItemController(app: FastifyInstance) {
  app.addHook("preHandler", AuthenticateUser);

  // /orderItem
  app.post("/", async (req, res) => {
    const orderItemSchemaBody = z.object({
      name: z.string(),
      price: z.number(),
      quantity: z
        .number()
        .min(1, "Você precisa cadastrar pelo menos 1 produto"),
      order_id: z.string().uuid(),
    });

    try {
      const { name, price, quantity, order_id } = orderItemSchemaBody.parse(
        req.body
      );

      await prisma.orderItem.create({
        data: {
          name,
          price,
          quantity,
          order_id,
        },
      });

      return res.status(201).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /orderItem/::orderItemId
  app.delete("/:orderItemId", async (req, res) => {
    const orderItemIdSchema = z.object({
      orderItemId: z.string().uuid(),
    });

    try {
      const { orderItemId } = orderItemIdSchema.parse(req.params);

      await prisma.orderItem.delete({
        where: {
          id: orderItemId,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /orderItem/::orderItemId
  app.patch("/:orderItemId", async (req, res) => {
    const orderItemSchemaBody = z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      quantity: z
        .number()
        .min(1, "Você precisa cadastrar pelo menos 1 produto")
        .optional(),
    });

    const orderItemIdSchema = z.object({
      orderItemId: z.string().uuid(),
    });

    try {
      const orderItem = orderItemSchemaBody.parse(req.body);
      const { orderItemId } = orderItemIdSchema.parse(req.params);

      await prisma.orderItem.update({
        where: {
          id: orderItemId,
        },
        data: orderItem,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

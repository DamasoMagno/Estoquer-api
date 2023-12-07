import { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "../prisma";

export async function OrderItemController(app: FastifyInstance) {
  app.post("/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string(),
    });

    const orderItemSchemaBody = z.object({
      name: z.string(),
      price: z.number(),
      quantity: z
        .number()
        .min(1, "Você precisa cadastrar pelo menos 1 produto"),
      order_id: z.string().uuid(),
    });

    try {
      const { name, price, quantity } = orderItemSchemaBody.parse(req.body);
      const { orderId } = orderIdSchema.parse(req.params);

      await prisma.orderItem.create({
        data: {
          name,
          price,
          quantity,
          order_id: orderId,
        },
      });

      return res.status(201).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

import { FastifyInstance } from "fastify";
import { z } from "zod";

import { AuthenticateUser } from "../middlewares/Authenticate";
import { createOrderItemService } from "../services/create-order-item-service";
import { removeOrderItemService } from "../services/remove-order-item-service";
import { updateOrderItemService } from "../services/update-order-item-service";
import { listOrderItemsService } from "../services/list-order-items";
import { listOrderItemService } from "../services/list-order-item";

export async function OrderItemController(app: FastifyInstance) {
  app.addHook("preHandler", AuthenticateUser);

  // /item/items/orderId = List items of order
  app.get("/items/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      const orders = await listOrderItemsService({
        order_id: orderId,
      });

      return res.status(200).send(orders);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /item/:itemId = Order
  app.get("/:itemId", async (req, res) => {
    const orderIdSchema = z.object({
      itemId: z.string().uuid(),
    });

    try {
      const { itemId } = orderIdSchema.parse(req.params);

      const orderItem = await listOrderItemService({
        itemId,
      });

      return res.status(200).send(orderItem);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /item = Create item
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

      await createOrderItemService({
        name,
        price,
        quantity,
        order_id,
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /item/:itemId = Delete item
  app.delete("/:itemId", async (req, res) => {
    const orderItemIdSchema = z.object({
      itemId: z.string().uuid(),
    });

    try {
      const { itemId } = orderItemIdSchema.parse(req.params);

      await removeOrderItemService({
        itemId,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /item/:itemId = Update item
  app.patch("/:itemId", async (req, res) => {
    const orderItemSchemaBody = z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      quantity: z
        .number()
        .min(1, "Você precisa cadastrar pelo menos 1 produto")
        .optional(),
    });

    const orderItemIdSchema = z.object({
      itemId: z.string().uuid(),
    });

    try {
      const { name, price, quantity } = orderItemSchemaBody.parse(req.body);
      const { itemId } = orderItemIdSchema.parse(req.params);

      await updateOrderItemService({
        itemId,
        name,
        price,
        quantity,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

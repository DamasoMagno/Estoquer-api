import { FastifyInstance } from "fastify";
import { z } from "zod";

import { authenticateUser } from "../middlewares/Authenticate";

import { listOrdersService } from "../services/list-orders-service";
import { showOrderService } from "../services/show-order-service";
import { removeOrderService } from "../services/remove-order-service";
import { createOrderService } from "../services/create-order-service";
import { updateOrderService } from "../services/update-order-service";

export async function OrderController(app: FastifyInstance) {
  app.addHook("preHandler", authenticateUser);

  app.get("/", async (req, res) => {
    const { user } = req;

    const orderFiltersSchema = z.object({
      product: z.string().optional(),
      sort: z
        .enum(["price", "quantity", "deadline", "origin", "orderType"])
        .optional(),
      orderType: z.enum(["INPUT", "OUTPUT"]).optional(),
      origin: z.enum(["SUPPLIER", "CLIENT"]).optional(),
    });

    try {
      const { product, sort } = orderFiltersSchema.parse(req.query);

      const orders = await listOrdersService({
        sort,
        product,
        customerId: user.id,
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/:orderId", async (req, res) => {
    const { user } = req;

    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      const orders = await showOrderService({
        orderId,
        userId: user.id,
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.post("/", async (req, res) => {
    const { user } = req;

    const orderSchemaBody = z.object({
      product: z.string(),
      origin: z.enum(["SUPPLIER", "CLIENT"]),
      orderType: z.enum(["INPUT", "OUTPUT"]),
      deadline: z.string(),
      price: z.number(),
      quantity: z.number(),
    });

    try {
      const { product, orderType, origin, deadline, price, quantity } =
        orderSchemaBody.parse(req.body);

      const formatDeadline = new Date(deadline);

      await createOrderService({
        product,
        deadline: formatDeadline,
        origin,
        price,
        quantity,
        orderType,
        customerId: user.id,
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.patch("/:orderId", async (req, res) => {
    const orderSchemaBody = z.object({
      product: z.string().optional(),
      origin: z.enum(["SUPPLIER", "CLIENT"]).optional(),
      orderType: z.enum(["INPUT", "OUTPUT"]).optional(),
      deadline: z.date().optional(),
      finished: z.boolean().optional(),
    });

    const orderIdSchema = z.object({
      orderId: z.string(),
    });

    try {
      const { orderType, deadline, finished, origin, product } =
        orderSchemaBody.parse(req.body);

      const { orderId } = orderIdSchema.parse(req.params);

      await updateOrderService({
        product,
        orderType,
        deadline,
        isFinished: finished,
        origin,
        orderId,
      });

      return res.status(204).send();
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

      await removeOrderService({ orderId: orderId });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

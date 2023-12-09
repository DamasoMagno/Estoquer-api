import { FastifyInstance } from "fastify";
import { z } from "zod";

import { authenticateUser } from "../middlewares/Authenticate";
import { listOrdersService } from "../services/list-orders-service";
import { listOrderService } from "../services/list-order-service";
import { removeOrderService } from "../services/remove-order-service";
import { createOrderService } from "../services/create-order-service";
import { updateOrderService } from "../services/update-order-service";

export async function OrderController(app: FastifyInstance) {
  app.addHook("preHandler", authenticateUser);

  // /order = List orders
  app.get("/", async (req, res) => {
    const { user } = req;

    const orderFiltersSchema = z.object({
      title: z.string().optional(),
      type: z.enum(["Input", "Output"]).optional(),
    });

    try {
      const { title, type } = orderFiltersSchema.parse(req.query);

      const orders = await listOrdersService({
        title,
        type,
        user_id: user.id,
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId = Show order
  app.get("/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      const orders = await listOrderService({
        order_id: orderId,
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order = Create order
  app.post("/", async (req, res) => {
    const { user } = req;

    const orderSchemaBody = z.object({
      title: z.string(),
      origin: z.enum(["Supplier", "Client"]),
      type: z.enum(["Input", "Output"]),
      deadline: z.string(),
    });

    try {
      const { title, type, origin, deadline } = orderSchemaBody.parse(req.body);

      await createOrderService({
        title,
        deadline,
        origin,
        type,
        user_id: user.id,
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId = Update order
  app.patch("/:orderId", async (req, res) => {
    const orderSchemaBody = z.object({
      title: z.string().optional(),
      origin: z.enum(["Supplier", "Client"]).optional(),
      type: z.enum(["Input", "Output"]).optional(),
      deadline: z.date().optional(),
      finished: z.boolean().optional(),
    });

    const orderIdSchema = z.object({
      orderId: z.string(),
    });

    try {
      const { type, deadline, finished, origin, title } = orderSchemaBody.parse(
        req.body
      );
      const { orderId } = orderIdSchema.parse(req.params);

      await updateOrderService({
        type,
        deadline,
        finished,
        origin,
        title,
        order_id: orderId,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  // /order/:orderId = Delete order
  app.delete("/:orderId", async (req, res) => {
    const orderIdSchema = z.object({
      orderId: z.string().uuid(),
    });

    try {
      const { orderId } = orderIdSchema.parse(req.params);

      await removeOrderService({ order_id: orderId });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

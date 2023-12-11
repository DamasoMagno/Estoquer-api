import { FastifyInstance } from "fastify";
import { z } from "zod";

import { authenticateUser } from "../middlewares/Authenticate";

import { removeStockService } from "../services/remove-stock-service";
import { updateStockService } from "../services/update-stock-service";
import { listStocksService } from "../services/list-stocks-service";
import { showStockService } from "../services/show-stock-service";

export async function StockController(app: FastifyInstance) {
  app.addHook("preHandler", authenticateUser);

  app.get("/", async (req, res) => {
    const { user } = req;

    try {
      const stocks = await listStocksService({
        customerId: user.id,
      });

      return res.status(200).send(stocks);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/:stockId", async (req, res) => {
    const stockIdSchema = z.object({
      stockId: z.string().uuid(),
    });

    try {
      const { stockId } = stockIdSchema.parse(req.params);

      const orders = await showStockService({
        stockId,
      });

      return orders;
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.patch("/:stockId", async (req, res) => {
    const orderSchemaBody = z.object({
      quantity: z.number(),
    });
    const orderIdSchema = z.object({
      stockId: z.string(),
    });

    try {
      const { quantity } = orderSchemaBody.parse(req.body);
      const { stockId } = orderIdSchema.parse(req.params);

      await updateStockService({
        stockId,
        quantity,
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.delete("/:stockId", async (req, res) => {
    const stockIdSchema = z.object({
      stockId: z.string().uuid(),
    });

    try {
      const { stockId } = stockIdSchema.parse(req.params);

      await removeStockService({ stockId });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

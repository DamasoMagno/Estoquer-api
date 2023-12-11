import "dotenv/config";
import fastify from "fastify";
import jwt from "@fastify/jwt";
const app = fastify();

import { OrderController } from "./controller/Order";
import { UserController } from "./controller/User";
import { StockController } from "./controller/Stock";

app.register(jwt, {
  secret: String(process.env.DATABASE_URL),
});

app.register(OrderController, {
  prefix: "/order",
});

app.register(StockController, {
  prefix: "/stock",
});

app.register(UserController, {
  prefix: "/user",
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("listening on port 3333"));

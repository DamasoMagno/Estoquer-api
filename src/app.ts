import Fastify from "fastify";
import { hash } from "bcryptjs";
import { z } from "zod";
const app = Fastify();

import prisma from "./prisma";
import { OrderController } from "./controller/Order";
import { OrderItemController } from "./controller/OrderItem";

app.register(OrderController, {
  prefix: "/order",
});

app.register(OrderItemController, {
  prefix: "/orderItem",
});

app.post("/", async (req, res) => {
  const userSchemaBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const { email, password } = userSchemaBody.parse(req.body);

    const userSameEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userSameEmail) {
      return res.send("User already exists");
    }

    const passwordHashed = await hash(password, 6);

    await prisma.user.create({
      data: {
        email,
        password: passwordHashed,
      },
    });

    return res.status(201).send("");
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/", async () => {
  const users = await prisma.user.findMany({
    include: {
      orders: true,
    },
  });

  return users;
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("listening on port 3333"));

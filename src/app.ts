import Fastify from "fastify";
import { hash } from "bcryptjs";
import { z } from "zod";
const app = Fastify();

import prisma from "./prisma";

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

    await prisma.user.create({
      data: {
        email,
        password: await hash(password, 6),
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

app.post("/order", async (req, res) => {
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
      return res.status(500).send({ error: "Category or Origin is incorrect" });
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

app.patch("/order/:orderId", async (req, res) => {
  const orderSchemaBody = z.object({
    title: z.string().optional(),
    origin: z.enum(["Supplier", "Client"]).optional(),
    category: z.enum(["Input", "Output"]).optional(),
    user_id: z.string().optional(),
    deadline: z.date().optional(),
  });
  const orderIdSchema = z.object({
    orderId: z.string(),
  });

  try {
    const order = orderSchemaBody.parse(req.body);
    const { orderId } = orderIdSchema.parse(req.params);

    if (order.origin === "Supplier" && order.category !== "Input") {
      return res.status(500).send({ error: "Category or Origin is incorrect" });
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

app.delete("/order/:orderId", async (req, res) => {
  const orderIdSchema = z.object({
    orderId: z.string(),
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

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("listening on port 3333"));

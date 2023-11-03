import Fastify from "fastify";
const app = Fastify();

import { knex } from "./database";
import { z } from "zod";

app.post("/", async (req, res) => {
  const userSchemaBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const { name, email, password } = userSchemaBody.parse(req.body);

    const userSameEmail = await knex("user").where({ email }).first();

    if (userSameEmail) {
      return res.send("User already exists");
    }

    await knex("user").insert({
      name,
      email,
      password,
    });

    return res.status(201).send("");
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/", async () => {
  const userQuery = await knex("user").leftJoin('order', 'user.id', 'order.user_id').select("*");
  const users: { 
  id: number; name: string; email: string; password: string; orders: any[] }[] = [];

  userQuery.forEach(user => {
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      orders: [{
        title: user.title,
        origin: user.origin,
        category: user.category
      }]
    })
  })

  return users;
});

app.post("/order", async (req, res) => {
  const userSchemaBody = z.object({
    title: z.string(),
    origin: z.enum(['Supplier', 'Client']),
    category: z.enum(['Input', 'Output']),
    user_id: z.number()
  });

  try {
    const { title, category, origin, user_id } = userSchemaBody.parse(req.body);

    await knex("order").insert({
      title,
      category,
      origin,
      user_id
    });

    return res.status(201).send("");
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/order", async () => {
  const users = await knex("order").select('*');

  return users;
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("listening on port 3333"));

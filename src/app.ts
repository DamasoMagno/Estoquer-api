import Fastify from "fastify";
const app = Fastify();

import { knex } from "./database"

app.get("/", async (request, reply) => {
  const users = await knex('users').select('*');

  return users;
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("listening on port 3333"));

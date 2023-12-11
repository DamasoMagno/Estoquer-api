import { FastifyInstance } from "fastify";
import { z } from "zod";

import { authenticateUser } from "../middlewares/Authenticate";

import { createUserService } from "../services/create-user-service";
import { authenticateUserService } from "../services/authenticate-user-service";
import { showUserService } from "../services/show-user-service";

export async function UserController(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const userSchemaBody = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = userSchemaBody.parse(req.body);

      await createUserService({
        email,
        password,
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get(
    "/",
    {
      preHandler: authenticateUser,
    },
    async (req, res) => {
      const { user } = req;

      try {
        const myUser = await showUserService({ id: user.id });

        return res.status(201).send(myUser);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  );

  app.post("/auth", async (req, res) => {
    const userSchemaBody = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = userSchemaBody.parse(req.body);

      const { id } = await authenticateUserService({
        email,
        password,
      });

      const token = app.jwt.sign({ id }, { expiresIn: "10m" });

      return res.status(201).send({ token });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

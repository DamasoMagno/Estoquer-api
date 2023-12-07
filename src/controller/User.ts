import { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "../prisma";
import { compare, hash } from "bcryptjs";

export async function UserController(app: FastifyInstance) {
  // /user/register
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

  // /user
  app.get("/", async () => {
    const users = await prisma.user.findMany({
      include: {
        orders: true,
      },
    });

    return users;
  });

  // /user/auth
  app.post("/auth", async (req, res) => {
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

      if (!userSameEmail) {
        return res.send("Email/Password incorrect");
      }

      const passwordIsValid = await compare(password, userSameEmail.password);

      if (!passwordIsValid) {
        return res.send("Email/Password incorrect");
      }

      return res.status(201).jwtSign(
        {
          id: userSameEmail.id,
        },
        {
          expiresIn: "10m",
        }
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

import "@fastify/jwt";
import { JWT } from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
    };
  }
}

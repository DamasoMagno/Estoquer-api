import { FastifyReply, FastifyRequest } from "fastify";

export async function AuthenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    console.log("Está vindo aqui");
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}

import { hash } from "bcryptjs";

import prisma from "../prisma";
import { IUser } from "../interface";

export async function createUserService({ email, password }: IUser) {
  const userSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userSameEmail) {
    throw new Error("User already exists on system");
  }

  const passwordHashed = await hash(password, 8);

  await prisma.user.create({
    data: {
      email,
      password: passwordHashed,
    },
  });
}

import { compare } from "bcryptjs";

import prisma from "../prisma";
import { IUser } from "../interface";

export async function authenticateUserService({ email, password }: IUser) {
  const userSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!userSameEmail) {
    throw new Error("Email or Password is incorrect");
  }

  const passwordIsValid = await compare(password, userSameEmail.password);

  if (!passwordIsValid) {
    throw new Error("Email or Password is incorrect");
  }

  return userSameEmail;
}

import { compare } from "bcryptjs";
import prisma from "../prisma";

interface IUser {
  email: string;
  password: string;
}

export async function authenticateUserService({ email, password }: IUser) {
  const userSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!userSameEmail) {
    throw new Error("Email/Password incorrect");
  }

  const passwordIsValid = await compare(password, userSameEmail.password);

  if (!passwordIsValid) {
    throw new Error("Email/Password incorrect");
  }

  return userSameEmail;
}

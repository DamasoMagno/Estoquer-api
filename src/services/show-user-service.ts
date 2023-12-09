import prisma from "../prisma";

interface IUser {
  id: string;
}

export async function showUserService({ id }: IUser) {
  const users = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      orders: {
        select: {
          id: true,
          title: true,
          type: true,
          origin: true,
          deadline: true,
          finished: true,
          items: true,
        },
      },
    },
  });

  return users;
}

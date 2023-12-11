import prisma from "../prisma";

interface IUserId {
  id: string;
}

export async function showUserService({ id }: IUserId) {
  const users = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      orders: {
        select: {
          id: true,
          product: true,
          orderType: true,
          origin: true,
          deadline: true,
          isFinished: true,
        },
      },
      stock: true,
    },
  });

  return users;
}

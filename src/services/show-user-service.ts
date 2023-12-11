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
      orders: true,
      stock: true,
    },
  });

  return users;
}

import prisma from "../prisma";

interface IOrder {
  user_id: string;
  title?: string;
  type?: "Input" | "Output";
  sortBy?: "Pendent" | "Finished";
}

export async function listOrdersService({
  title,
  type,
  user_id,
  sortBy = "Pendent",
}: IOrder) {
  const sortOrdersBy = sortBy === "Pendent" ? "asc" : "desc";

  const orders = await prisma.order.findMany({
    where: {
      user_id,
      title,
      type,
    },
    orderBy: {
      finished: sortOrdersBy,
    },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
      },
    },
  });

  return orders;
}

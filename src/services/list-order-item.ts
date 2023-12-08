import prisma from "../prisma";

interface IOrder {
  itemId: string;
}

export async function listOrderItemService({ itemId }: IOrder) {
  const order = await prisma.orderItem.findUnique({
    where: {
      id: itemId,
    },
  });

  return order;
}

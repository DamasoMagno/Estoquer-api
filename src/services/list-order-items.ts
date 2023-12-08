import prisma from "../prisma";

interface IOrder {
  order_id: string;
}

export async function listOrderItemsService({ order_id }: IOrder) {
  const order = await prisma.orderItem.findMany({
    where: {
      order_id: order_id,
    },
  });

  return order;
}

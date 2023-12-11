import prisma from "../prisma";

interface IOrder {
  orderId: string;
  userId: string;
}

export async function showOrderService({ orderId, userId }: IOrder) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      customerId: userId,
    },
  });

  return order;
}

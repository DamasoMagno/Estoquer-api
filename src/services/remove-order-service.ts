import prisma from "../prisma";

interface IOrderId {
  orderId: string;
}

export async function removeOrderService({ orderId }: IOrderId) {
  const orderNotFound = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!orderNotFound) {
    throw new Error("Order removed or not found on system");
  }

  await prisma.order.delete({
    where: {
      id: orderId,
    },
  });
}

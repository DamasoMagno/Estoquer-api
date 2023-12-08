import prisma from "../prisma";

interface IOrderItem {
  order_id: string;
}

export async function removeOrderService({ order_id }: IOrderItem) {
  const orderNotFound = await prisma.order.findUnique({
    where: {
      id: order_id,
    },
  });

  if (!orderNotFound) {
    throw new Error("This order already removed or not found on system");
  }

  await prisma.order.delete({
    where: {
      id: order_id,
    },
  });
}

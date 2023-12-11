import prisma from "../prisma";
import { IOrder } from "../interface";

export async function createOrderService({ ...order }: IOrder) {
  await prisma.order.create({
    data: order,
  });

  const stock = await prisma.stock.findUnique({
    where: {
      product: order.product,
    },
    select: {
      id: true,
      quantity: true,
      ownerId: true,
    },
  });

  if (!stock && order.orderType === "INPUT") {
    await prisma.stock.create({
      data: {
        product: order.product,
        ownerId: order.customerId,
        quantity: order.quantity,
        createdAt: new Date(),
      },
    });

    return;
  }

  const newQuantity =
    order?.orderType === "INPUT"
      ? (stock?.quantity ?? 0) + order.quantity
      : (stock?.quantity ?? 0) - order.quantity;

  if (
    order.orderType == "OUTPUT" &&
    (stock?.quantity ?? 0) - order.quantity < 0
  ) {
    throw new Error(
      `The quantity required of ${order.product} is not available on system`
    );
  }

  await prisma.stock.update({
    where: {
      id: stock?.id,
    },
    data: {
      quantity: newQuantity,
    },
  });
}

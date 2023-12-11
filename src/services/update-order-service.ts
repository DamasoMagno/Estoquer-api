import prisma from "../prisma";

export type IOrderType = "INPUT" | "OUTPUT";
export type IOrderOrigin = "SUPPLIER" | "CLIENT";

interface IOrder {
  orderId: string;
  product?: string;
  price?: number;
  quantity?: number;
  deadline?: Date;
  origin?: IOrderOrigin;
  orderType?: IOrderType;
  isFinished?: boolean;
}

export async function updateOrderService({ orderId, ...order }: IOrder) {
  if (order.origin === "SUPPLIER" && order.orderType !== "INPUT") {
    throw new Error(`Type ${order.orderType} is not valid to ${origin}`);
  }

  const checkOrderExists = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!checkOrderExists) {
    throw new Error("This order's removed from system");
  }

  if (checkOrderExists.isFinished) {
    throw new Error("This order's finished");
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: order,
  });
}

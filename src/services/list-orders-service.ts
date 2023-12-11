import prisma from "../prisma";

export type IOrderType = "INPUT" | "OUTPUT";

interface IOrder {
  customerId: string;
  product?: string;
  orderType?: IOrderType;
  sortBy?: "Pendent" | "Finished";
}

export async function listOrdersService({
  product,
  orderType,
  customerId,
  sortBy = "Pendent",
}: IOrder) {
  const sortOrders = sortBy === "Pendent" ? "asc" : "desc";

  const orders = await prisma.order.findMany({
    where: {
      customerId,
      product,
      orderType,
    },
    orderBy: {
      isFinished: sortOrders,
    },
  });

  return orders;
}

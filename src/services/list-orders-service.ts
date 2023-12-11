import { IOrder } from "../interface";
import prisma from "../prisma";

export interface IListOrders {
  customerId: string;
  product?: string;
  sort?: keyof Omit<IOrder, "customerId" | "product">;
}

export async function listOrdersService({
  product,
  customerId,
  sort = "origin",
}: IListOrders) {
  const orders = await prisma.order.findMany({
    where: {
      product,
      customerId,
    },
    orderBy: {
      [sort]: sort ? "asc" : "desc",
    },
  });

  return orders;
}

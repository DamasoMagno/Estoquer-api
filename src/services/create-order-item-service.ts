import prisma from "../prisma";

interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  order_id: string;
}

export async function createOrderItemService({
  name,
  order_id,
  price,
  quantity,
}: IOrderItem) {
  await prisma.orderItem.create({
    data: {
      name,
      price,
      quantity,
      order_id,
    },
  });
}

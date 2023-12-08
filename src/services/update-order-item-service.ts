import prisma from "../prisma";

interface IOrderItem {
  name?: string;
  quantity?: number;
  price?: number;
  itemId?: string;
}

export async function updateOrderItemService({
  name,
  itemId,
  price,
  quantity,
}: IOrderItem) {
  await prisma.orderItem.update({
    where: {
      id: itemId,
    },
    data: {
      name,
      price,
      quantity,
    },
  });
}

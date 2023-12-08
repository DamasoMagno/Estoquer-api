import prisma from "../prisma";

interface IOrderItem {
  itemId: string;
}

export async function removeOrderItemService({ itemId }: IOrderItem) {
  await prisma.orderItem.delete({
    where: {
      id: itemId,
    },
  });
}

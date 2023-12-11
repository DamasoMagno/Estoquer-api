import prisma from "../prisma";

interface IOrderUpdate {
  stockId: string;
  quantity: number;
}

export async function updateStockService({ stockId, quantity }: IOrderUpdate) {
  await prisma.stock.update({
    where: {
      id: stockId,
    },
    data: {
      quantity,
    },
  });
}

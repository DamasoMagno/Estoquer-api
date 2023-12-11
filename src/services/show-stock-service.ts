import prisma from "../prisma";

export interface IListStock {
  stockId: string;
}

export async function showStockService({ stockId }: IListStock) {
  const orders = await prisma.stock.findUnique({
    where: {
      id: stockId,
    },
  });

  return orders;
}

import prisma from "../prisma";

interface IOrderId {
  stockId: string;
}

export async function removeStockService({ stockId }: IOrderId) {
  const orderNotFound = await prisma.stock.findUnique({
    where: {
      id: stockId,
    },
  });

  if (!orderNotFound) {
    throw new Error("Order removed or not found on system");
  }

  await prisma.stock.delete({
    where: {
      id: stockId,
    },
  });
}

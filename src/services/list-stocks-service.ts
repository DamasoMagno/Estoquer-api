import prisma from "../prisma";

export interface IListStock {
  customerId: string;
}

export async function listStocksService({ customerId }: IListStock) {
  const orders = await prisma.stock.findMany({
    where: {
      ownerId: customerId,
    },
  });

  return orders;
}

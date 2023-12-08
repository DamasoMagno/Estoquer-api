import prisma from "../prisma";

interface IOrder {
  order_id: string;
  user_id?: string;
}

export async function listOrderService({ order_id }: IOrder) {
  const order = await prisma.order.findUnique({
    where: {
      id: order_id,
      // user_id,
    },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
      },
    },
  });

  return order;
}

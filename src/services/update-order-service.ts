import prisma from "../prisma";

interface IOrder {
  title?: string;
  origin?: "Supplier" | "Client";
  type?: "Input" | "Output";
  deadline?: Date;
  finished?: boolean;
  order_id: string;
}

export async function updateOrderService({
  title,
  deadline,
  origin,
  type,
  finished,
  order_id,
}: IOrder) {
  if (origin === "Supplier" && type !== "Input") {
    throw new Error("Category or Origin is incorrect");
  }

  const orderIsFinished = await prisma.order.findUnique({
    where: {
      id: order_id,
    },
  });

  if (!orderIsFinished) {
    throw new Error("This order's removed from system");
  }

  if (orderIsFinished.finished) {
    throw new Error("This order's finished");
  }

  await prisma.order.update({
    where: {
      id: order_id,
    },
    data: {
      title,
      deadline,
      origin,
      type,
      finished,
    },
  });
}

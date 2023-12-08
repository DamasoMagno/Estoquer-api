import prisma from "../prisma";

interface IOrder {
  title: string;
  origin: "Supplier" | "Client";
  type: "Input" | "Output";
  deadline: string;
  user_id: string;
}

export async function createOrderService({
  title,
  deadline,
  origin,
  type,
  user_id,
}: IOrder) {
  if (origin === "Supplier" && type !== "Input") {
    throw new Error("Category or Origin is incorrect");
  }

  let deadLineFormattedToDate = new Date(deadline);

  if (deadLineFormattedToDate < new Date()) {
    throw new Error("You should be able register a posterior date");
  }

  await prisma.order.create({
    data: {
      title,
      type,
      origin,
      user_id,
      deadline,
    },
  });
}

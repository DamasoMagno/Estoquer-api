export interface IUser {
  email: string;
  password: string;
}

export interface IOrder {
  product: string;
  price: number;
  quantity: number;
  deadline: Date;
  origin: IOrderOrigin;
  orderType: IOrderType;
  customerId: string;
}

export type IOrderOrigin = "SUPPLIER" | "CLIENT";

export type IOrderType = "INPUT" | "OUTPUT";

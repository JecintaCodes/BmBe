import { Document } from "mongoose";

interface iUser {
  name: string;
  email: string;
  role: string;
  image?: string;
  imageID?: string;
  password: string;
  secretCode: string;
  bankName: string;
  bankCode?: string;
  subAccountCode: string;
  address: string;
  accountNumb: string;
  description?: string;
  telNumb?: string;
  products: {}[];
  myStore: [];
  order: {}[];
  verify: boolean;
  verifyToken: string;
  token: string;
  lists: {}[];
  payments: {}[];
}
export interface iUserData extends iUser, Document {}

interface iProduct {
  title: string;
  postBy?: string;
  img: string;
  description?: string;
  amount: number;
  QTYinStock: number;
  storeID?: string;
  toggle?: boolean;
  // accountNumber: string;
  userID: string;
  users: {};
  payments: {}[];
}

export interface iProductData extends iProduct, Document {}

interface iList {
  refNumb?: string;
  title: string;
  customerCode?: string;
  status?: string;
  email: string;
  amount: number;
  totalAmount: number;
  userID: {};
  orders: {}[];
  lists: { amount: number; title: string }[];
}

export interface iListData extends iList, Document {}

interface iOrder {
  title: string;
  customerCode?: string;
  productOwner?: string;
  img: string;
  description?: string;
  totalAmount: number;
  amountPaid?: number;
  QTYOrder: number;
  address: string;
  status: string;
  userID: string;
  phoneNumb: string;
  date: Date;
  category: string;
  users: {};
  payments: {}[];
  lists: {}[];
  splitPayments: [{}];
  productDetails: [{}];
}

export interface iOrderData extends iOrder, Document {}

interface iPayment {
  refNumb: string;
  email: string;
  amount: number;
  status: string;
  userID: string;
  phoneNumb: string;
  customerCode: string;
  QTYOrder: number;
  address: string;
  users: {}[];
  products: {}[];
  orders: {}[];
  splitPayments: [{}];
}

export interface iPaymentData extends iPayment, Document {}

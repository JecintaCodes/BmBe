import { Document, model, Schema, Types } from "mongoose";

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
}

interface iOrderData extends iOrder, Document {}

const orderModel = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    productOwner: {
      type: String,
    },

    status: {
      type: String,
    },
    phoneNumb: {
      type: String,
    },

    img: {
      type: String,
    },
    description: {
      type: String,
    },

    totalAmount: {
      type: Number,
    },
    amountPaid: {
      type: Number,
    },

    date: {
      type: Date,
    },
    customerCode: {
      type: String,
    },
    address: {
      type: String,
    },
    category: {
      type: String,
    },
    QTYOrder: {
      type: Number,
      default: 0,
    },

    users: {
      type: Types.ObjectId,
      ref: "users",
    },
    payments: [
      {
        type: Types.ObjectId,
        ref: "payments",
      },
    ],
    lists: [
      {
        type: Types.ObjectId,
        ref: "lists",
      },
    ],
  },
  { timestamps: true }
);
export default model<iOrderData>("orders", orderModel);

import { Document, model, Schema, Types } from "mongoose";

interface iOrder {
  title: string;
  productOwner: string;
  img: string;
  description?: string;
  amountPaid: number;
  QTYOrder: number;
  address: string;
  userID: string;
  users: {};
  payments: {}[];
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
    orderOwner: {
      type: String,
    },

    img: {
      type: String,
    },
    description: {
      type: String,
    },

    amountPaid: {
      type: Number,
    },

    address: {
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
  },
  { timestamps: true }
);
export default model<iOrderData>("orders", orderModel);

import { model, Types, Document, Schema } from "mongoose";

interface iPayment {
  refNumb: string;
  email: string;
  amount: string;
  userID: string;
  phoneNumb: string;
  address: string;
  users: {}[];
  products: {}[];
  orders: {}[];
}

interface iPaymentData extends iPayment, Document {}

const paymentModel = new Schema<iPaymentData>(
  {
    refNumb: {
      type: String,
    },
    email: {
      type: String,
    },
    userID: {
      type: String,
    },
    phoneNumb: {
      type: String,
    },
    address: {
      type: String,
    },
    amount: {
      type: String,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "users",
      },
    ],
    products: [
      {
        type: Types.ObjectId,
        ref: "prosucts",
      },
    ],
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders",
      },
    ],
  },
  { timestamps: true }
);

export default model<iPaymentData>("payments", paymentModel);

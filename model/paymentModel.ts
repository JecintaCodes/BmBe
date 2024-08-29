import { model, Types, Document, Schema } from "mongoose";

interface iPayment {
  refNumb: string;
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

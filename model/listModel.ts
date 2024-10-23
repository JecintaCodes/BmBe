import { Schema, Document, model, Types } from "mongoose";

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

interface iListData extends iList, Document {}

const listModel = new Schema<iListData>(
  {
    refNumb: {
      type: String,
    },
    title: {
      type: String,
      required: true, // Required field
    },
    email: {
      type: String,
    },
    status: {
      type: String,
    },
    customerCode: {
      type: String,
    },
    amount: {
      type: Number,
      required: true, // Required field
    },
    totalAmount: {
      type: Number,
    },
    userID: {
      type: Types.ObjectId,
      ref: "users", // Assuming your user model is named "users"
      index: true, // Index for efficient querying
    },
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders", // Assuming your order model is named "orders"
      },
    ],
    lists: [
      {
        amount: { type: Number, required: true }, // Validate amount
        title: { type: String, required: true }, // Validate title
      },
    ],
  },
  { timestamps: true }
);

export default model<iListData>("lists", listModel);

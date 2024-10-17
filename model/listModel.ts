import { Schema, Document, model, Types } from "mongoose";

interface iList {
  refNumb: string;
  title: string;
  email: string;
  amount: number;
  userID: {};
  orders: {}[];
}

interface iListData extends iList, Document {}

const listModel = new Schema<iListData>(
  {
    refNumb: {
      type: String,
    },
    title: {
      type: String,
    },
    email: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userID: {
      type: Types.ObjectId,
      ref: "users", // Assuming your user model is named "users"
    },
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders", // Assuming your user model is named "users"
      },
    ],
  },
  { timestamps: true }
);

export default model<iListData>("lists", listModel);

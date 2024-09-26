import { Schema, Document, model, Types } from "mongoose";

interface iList {
  title: string;
  amount: number;
  userID: {};
}

interface iListData extends iList, Document {}

const listModel = new Schema<iListData>(
  {
    title: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userID: {
      type: Types.ObjectId,
      ref: "users", // Assuming your user model is named "users"
    },
  },
  { timestamps: true }
);

export default model<iListData>("lists", listModel);

import { Schema, Document, model, Types } from "mongoose";

interface iList {
  title: string;
  amount: number;
  userID: string;
  //   users: {}[];
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
      type: String,
    },
  },
  //   users: [
  //       {
  //         type: Types.ObjectId,
  //         ref: "users",
  //       },
  //     ],
  //   },
  { timestamps: true }
);

export default model<iListData>("lists", listModel);

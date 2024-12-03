import { model, Types } from "mongoose";
import { Document, Schema } from "mongoose";

interface iServices {
  description: string;
  title: string;
  url: string;
  serviceOwnerName: string;
  userID: string;
  amount: number;
  images: string;
  users: {}[];
  payments: string[];
  orders: string[];
  categorys: [{}];
  category: string;
}
interface iServicesData extends iServices, Document {}

const serviceModel = new Schema<iServicesData>(
  {
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    serviceOwnerName: {
      type: String,
    },
    userID: {
      type: String,
    },
    amount: {
      type: Number,
    },
    images: {
      type: String,
    },
    category: {
      type: String,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "users",
      },
    ],
    payments: [
      {
        type: Types.ObjectId,
        ref: "payments",
      },
    ],
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders",
      },
    ],
    categorys: [
      {
        type: Types.ObjectId,
        ref: "categories",
      },
    ],
  },
  { timestamps: true }
);
export default model<iServicesData>("services", serviceModel);

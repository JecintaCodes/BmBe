import { model, Types } from "mongoose";
import { Document, Schema } from "mongoose";

interface iServices {
  description: string;
  title: string;
  url: string;
  refNumb: string;
  serviceOwnerName: string;
  userID: string;
  amount: number;
  customerCode: string;
  img: string;
  users: {}[];
  payments: string[];
  orders: string[];
  serviceCategory: [{}];
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
    customerCode: {
      type: String,
    },
    serviceOwnerName: {
      type: String,
    },
    userID: [
      {
        type: String,
      },
    ],
    amount: {
      type: Number,
    },
    img: {
      type: String,
    },
    category: {
      type: String,
    },
    refNumb: {
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
    serviceCategory: [
      {
        type: Types.ObjectId,
        ref: "servicecategories",
      },
    ],
  },
  { timestamps: true }
);
export default model<iServicesData>("services", serviceModel);

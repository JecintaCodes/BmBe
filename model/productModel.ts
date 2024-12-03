import { Document, model, Schema, Types } from "mongoose";

interface iProduct {
  title: string;
  postBy?: string;
  img: string;
  imgID: string;
  description?: string;
  amount: number;
  QTYinStock: number;
  storeID?: string;
  catagorys: [{}];
  catagory: string;
  toggle?: boolean;
  userID: string;
  users: {};
  payments: {}[];
  orders: {}[];
}

interface iProductData extends iProduct, Document {}

const productModel = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    userID: {
      type: String,
    },
    postBy: {
      type: String,
    },
    img: {
      type: String,
    },
    imgID: {
      type: String,
    },
    description: {
      type: String,
    },
    storeID: {
      type: String,
    },
    category: {
      type: String,
    },
    amount: {
      type: Number,
      require: true,
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    QTYinStock: {
      type: Number,
      default: 1,
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
    categorys: [
      {
        type: Types.ObjectId,
        ref: "categories",
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
export default model<iProductData>("prods", productModel);

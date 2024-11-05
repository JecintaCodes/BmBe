import { Document, model, Schema, Types } from "mongoose";
interface iOrder {
  title: string;
  customerCode?: string;
  productOwner?: string;
  img: string;
  description?: string;
  totalAmount: number;
  amountPaid?: number;
  QTYOrder: number;
  address: string;
  status: string;
  email: string;
  userID: string;
  phoneNumb: string;
  date: Date;
  category: string;
  users: {};
  payments: [];
  lists: {}[];
  splitPayments: [{}];
  productDetails: [{}];
}

interface iOrderData extends iOrder, Document {}

const orderModel = new Schema(
  {
    title: {
      type: String,
      required: true, // Changed 'require' to 'required'
    },
    productOwner: {
      type: String,
    },

    status: {
      type: String,
    },
    phoneNumb: {
      type: String,
    },

    img: {
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
    },

    totalAmount: {
      type: Number,
    },
    amountPaid: {
      type: Number,
    },

    date: {
      type: Date,
      default: Date.now, // Added default date
    },
    customerCode: {
      type: String,
    },
    address: {
      type: String,
    },
    category: {
      type: String,
    },
    QTYOrder: {
      type: Number,
      default: 0,
    },
    productDetails: [
      {
        productID: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        amount: { type: Number },
        platformFee: { type: Number },
        amountAfterFee: { type: Number },
      },
    ],

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
    splitPayments: [
      {
        subaccount: String,
        amount: Number,
        platformFee: Number,
      },
    ],
    lists: [
      {
        productID: { type: Schema.Types.ObjectId, ref: "Product" },

        title: { type: String },
        amount: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default model<iOrderData>("orders", orderModel);

import { model, Schema, Types } from "mongoose";
import { iUserData } from "../utils/interface";
// interface iUser {
//   name: string;
//   email: string;
//   role: string;
//   image?: string;
//   imageID?: string;
//   password: string;
//   secretCode: string;
//   bankName: string;
//   bankCode?: string;
//   subAccountCode: string;
//   address: string;
//   accountNumb: string;
//   description?: string;
//   telNumb?: string;
//   products: {}[];
//   myStore: [];
//   order: {}[];
//   verify: boolean;
//   verifyToken: string;
//   verifyTokenExp: string;
//   lists: {}[];
//   payments: {}[];
// }

// interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    telNumb: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
    },
    subAccountCode: {
      type: String,
    },
    verifyTokenExp: {
      type: String,
    },
    accountNumb: {
      type: String,
    },
    bankName: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    verifyToken: {
      type: String,
    },
    image: {
      type: String,
    },
    imageID: {
      type: String,
    },

    description: {
      type: String,
    },

    secretCode: {
      type: String,
      require: true,
    },

    verify: {
      type: Boolean,
      default: false,
    },

    myStore: [
      {
        type: Types.ObjectId,
        ref: "prods",
      },
    ],
    services: [
      {
        type: Types.ObjectId,
        ref: "services",
      },
    ],
    lists: [
      {
        type: Types.ObjectId,
        ref: "lists",
      },
    ],

    order: [
      {
        type: Types.ObjectId,
        ref: "orders",
      },
    ],
    payments: [
      {
        type: Types.ObjectId,
        ref: "payments",
      },
    ],
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);

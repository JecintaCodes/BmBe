import { model, Schema, Types, Document } from "mongoose";
interface iUser {
  name: string;
  email: string;
  role: string;
  image?: string;
  imageID?: string;
  password: string;
  secretCode: string;
  address: string;
  description?: string;
  products: {}[];
  myStore: {}[];
  order: {}[];
  verify: boolean;
  verifyToken: string;
  lists: {}[];
}

interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    address: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      require: true,
    },

    role: {
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
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);

import { model, Schema, Types } from "mongoose";

interface iCategory {
  categoryName: string;
  services: {}[];
  products: {}[];
  BookRide: string[];
}
interface iCategoryData extends iCategory, Document {}

const categoryModel = new Schema<iCategoryData>(
  {
    categoryName: {
      type: String,
      require,
    },
    services: [
      {
        type: Types.ObjectId,
        ref: "services",
      },
    ],
    products: [
      {
        type: Types.ObjectId,
        ref: "prods",
      },
    ],
    BookRide: [
      {
        type: Types.ObjectId,
        ref: "bookRides",
      },
    ],
  },
  { timestamps: true }
);
export default model<iCategoryData>("categories", categoryModel);

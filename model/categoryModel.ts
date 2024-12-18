import { model, Schema, Types } from "mongoose";

interface iProductCategory {
  img?: string;
  imgID?: string;
  categoryName: string;
  products: {}[];
  // BookRide: string[];
}
interface iProductCategoryData extends iProductCategory, Document {}

const categoryModel = new Schema<iProductCategoryData>(
  {
    categoryName: {
      type: String,
      require,
    },
    img: {
      type: String,
    },
    imgID: {
      type: String,
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "prods",
      },
    ],
    // BookRide: [
    //   {
    //     type: Types.ObjectId,
    //     ref: "bookRides",
    //   },
    // ],
  },
  { timestamps: true }
);
export default model<iProductCategoryData>("categories", categoryModel);

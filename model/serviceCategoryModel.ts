import { model, Schema, Types } from "mongoose";

interface iServiceCategory {
  img?: string;
  imgID?: string;
  description?: string;
  serviceCategoryName: string;
  services: {}[];
}
interface iServiceDataCateory extends iServiceCategory, Document {}

const ServiceCategoryModel = new Schema<iServiceDataCateory>(
  {
    serviceCategoryName: {
      type: String,
      require,
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
    services: [
      {
        type: Types.ObjectId,
        ref: "services",
      },
    ],
  },
  { timestamps: true }
);
export default model<iServiceDataCateory>(
  "servicecategories",
  ServiceCategoryModel
);

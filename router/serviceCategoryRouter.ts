import { Router } from "express";
import {
  createServiceCategory,
  findOneServiceCategory,
  getAllServiceCategory,
} from "../controller/serviceCategoryControllerf";
// import serviceCategoryModel from "../model/serviceCategoryModel";
import multer from "multer";
const upload = multer().single("img");
const serviceCategoryRouter = Router();

serviceCategoryRouter
  .route("/create-service-category")
  .post(upload,createServiceCategory);
serviceCategoryRouter
  .route("/get-services-category")
  .get(getAllServiceCategory);
serviceCategoryRouter
  .route("/find-one-services-category/:categoryID")
  .get(findOneServiceCategory);
export default serviceCategoryRouter;

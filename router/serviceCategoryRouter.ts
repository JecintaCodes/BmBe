import { Router } from "express";
import {
  createServiceCategory,
  getAllServiceCategory,
} from "../controller/serviceCategoryControllerf";
// import serviceCategoryModel from "../model/serviceCategoryModel";

const serviceCategoryRouter = Router();

serviceCategoryRouter.route("/service-category").post(createServiceCategory);
serviceCategoryRouter
  .route("/get-services-category")
  .get(getAllServiceCategory);
export default serviceCategoryRouter;

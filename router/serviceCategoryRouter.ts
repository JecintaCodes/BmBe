import { Router } from "express";
import {
  createServiceCategory,
  findOneServiceCategory,
  getAllServiceCategory,
} from "../controller/serviceCategoryControllerf";
// import serviceCategoryModel from "../model/serviceCategoryModel";

const serviceCategoryRouter = Router();

serviceCategoryRouter
  .route("/create-service-category")
  .post(createServiceCategory);
serviceCategoryRouter
  .route("/get-services-category")
  .get(getAllServiceCategory);
serviceCategoryRouter
  .route("/:categoryID/find-one-services-category")
  .get(findOneServiceCategory);
export default serviceCategoryRouter;

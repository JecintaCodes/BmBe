import { Router } from "express";
import { createServiceCategory } from "../controller/serviceCategoryControllerf";
// import serviceCategoryModel from "../model/serviceCategoryModel";

const serviceCategoryRouter = Router();

serviceCategoryRouter.route("service-category").post(createServiceCategory);

export default serviceCategoryRouter;

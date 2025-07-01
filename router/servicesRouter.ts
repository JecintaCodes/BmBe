import { Router } from "express";
import multer from "multer";
import {
  allServiceCategory,
  createServices,
  deleteService,
  getOneService,
  getOneUserServices,
  TotalService,
  userTotalServices,
  
} from "../controller/servicesController";
const upload = multer().single("img");
const servicesRouter = Router();

servicesRouter.route("/:userID/register-services").post(upload, createServices);
servicesRouter.route("/service-category").get(allServiceCategory);
// servicesRouter.route("/all-service-category").get(allCategoryServices);
servicesRouter.route("/:userID/get-user-services").get(getOneUserServices);
servicesRouter.route("/:serviceID/one-services").get(getOneService);
servicesRouter.route("/total-services").get(TotalService);
servicesRouter.route("/:userID/total-user-services").get(userTotalServices);
servicesRouter
  .route("/:userID/:serviceCategoryID/:serviceID/delete-service")
  .delete(deleteService);
export default servicesRouter;

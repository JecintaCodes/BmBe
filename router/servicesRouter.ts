import { Router } from "express";
import multer from "multer";
import {
  allServiceCategory,
  createServices,
  getOneService,
  getOneUserServices,
} from "../controller/servicesController";
const upload = multer().single("image");
const servicesRouter = Router();

servicesRouter.route("/:userID/register-services").post(upload, createServices);
servicesRouter.route("/service-category").get(allServiceCategory);
// servicesRouter.route("/all-service-category").get(allCategoryServices);
servicesRouter.route("/:userID/get-user-services").get(getOneUserServices);
servicesRouter.route("/:serviceID/one-services").get(getOneService);
export default servicesRouter;

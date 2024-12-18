import { Router } from "express";
import multer from "multer";
import {
  allControllerServices,
  allServiceCategory,
  createServices,
} from "../controller/servicesController";
const upload = multer().single("image");
const servicesRouter = Router();

servicesRouter.route("/:userID/register-services").post(upload, createServices);
servicesRouter.route("/service-category").get(allServiceCategory);
servicesRouter.route("/all-service-category").get(allControllerServices);
export default servicesRouter;

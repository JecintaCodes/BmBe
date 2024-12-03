import { Router } from "express";
import multer from "multer";
import { createServices } from "../controller/servicesController";
const upload = multer().single("image");
const servicesRouter = Router();

servicesRouter.route("/:userID/register-services").post(upload, createServices);
export default servicesRouter;

import { Router } from "express";
import {
  crateCategory,
  findOneProductCategory,
  findOneServiceCategory,
} from "../controller/categoryController";

const categoryRouter = Router();

categoryRouter.route("/create-category").post(crateCategory);
categoryRouter.route("/:categoryID/find-services").get(findOneServiceCategory);
categoryRouter.route("/:categoryID/find-products").get(findOneProductCategory);
// categoryRouter.route("/find-product").get(findOneProductCategory);

export default categoryRouter;

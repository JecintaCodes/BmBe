import { Router } from "express";
import {
  crateCategory,
  findOneProductsCategory,
  findOneServiceCategory,
  getAllCategory,
} from "../controller/categoryController";

const categoryRouter = Router();

categoryRouter.route("/create-category").post(crateCategory);
categoryRouter.route("/get-category").get(getAllCategory);
categoryRouter.route("/:categoryID/find-services").get(findOneServiceCategory);
categoryRouter.route("/:categoryID/find-products").get(findOneProductsCategory);
// categoryRouter.route("/find-product").get(findOneProductCategory);

export default categoryRouter;

import { Router } from "express";
import {
  crateCategory,
  findOneCategoryProducts,
  findOneProductsCategory,
  getAllCategory,
} from "../controller/categoryController";
import multer from "multer";
const upload = multer().single("img");
const categoryRouter = Router();

categoryRouter.route("/create-category").post(upload,crateCategory);
categoryRouter.route("/get-category").get(getAllCategory);
categoryRouter.route("/:categoryID/find-products").get(findOneProductsCategory);
categoryRouter.route("/:productID/find-cats").get(findOneCategoryProducts);
export default categoryRouter;

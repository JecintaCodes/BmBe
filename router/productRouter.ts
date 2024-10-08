import { Router } from "express";
import {
  createProduct,
  readProduct,
  readOneProduct,
  purchaseProduct,
  viewOrders,
  deleteProduct,
  createProductList,
  deleteProductList,
  getLists,
  viewUserProduct,
} from "../controller/productController";
import multer from "multer";
const upload = multer().single("image");
const productRouter = Router();

productRouter.route("/:userID/register-products").post(upload, createProduct);
productRouter.route("/get-all-product").get(readProduct);
productRouter.route("/:productID/get-one-product").get(readOneProduct);
productRouter
  .route("/:userID/:productID/purchase-product")
  .post(purchaseProduct);
productRouter.route("/:userID/view-user-products").get(viewUserProduct);
productRouter.route("/:userID/view-orders").get(viewOrders);
productRouter.route("/:userID/:productID/delete-product").delete(deleteProduct);
productRouter.route("/:userID/create-list").post(createProductList);
productRouter.route("/:listID/delete-list").delete(deleteProductList);
productRouter.route("/:userID/get-list").get(getLists);

export default productRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controller/productController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)().single("image");
const productRouter = (0, express_1.Router)();
productRouter.route("/:userID/register-products").post(upload, productController_1.createProduct);
productRouter.route("/get-all-product").get(productController_1.readProduct);
productRouter.route("/:productID/get-one-product").get(productController_1.readOneProduct);
productRouter
    .route("/:userID/:productID/purchase-product")
    .post(productController_1.purchaseProduct);
productRouter.route("/:userID/view-user-products").get(productController_1.viewUserProduct);
productRouter.route("/:userID/view-orders").get(productController_1.viewOrders);
productRouter.route("/:userID/:productID/delete-product").delete(productController_1.deleteProduct);
productRouter.route("/:userID/create-list").post(productController_1.createProductList);
productRouter.route("/:listID/delete-list").delete(productController_1.deleteProductList);
productRouter.route("/:userID/get-list").get(productController_1.getLists);
exports.default = productRouter;

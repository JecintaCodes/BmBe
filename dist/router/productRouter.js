"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importStar(require("../controller/productController"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)().single("image");
const productRouter = (0, express_1.Router)();
productRouter.route("/:userID/register-products").post(upload, productController_1.createProduct);
productRouter.route("/get-all-product").get(productController_1.readProduct);
productRouter.route("/get-all-order").get(productController_1.readOrders);
productRouter.route("/get-all-list").get(productController_1.viewAllLists);
productRouter.route("/:productID/get-one-product").get(productController_1.readOneProduct);
productRouter
    .route("/:userID/:productID/purchase-product")
    .post(productController_1.purchaseProduct);
productRouter.route("/:userID/view-user-products").get(productController_1.viewUserProduct);
productRouter.route("/:userID/view-products-user").get(productController_1.viewProductUser);
productRouter.route("/:userID/view-orders").get(productController_1.viewOrders);
productRouter.route("/:userID/:productID/delete-product").delete(productController_1.deleteProduct);
productRouter.route("/:userID/create-list").post(productController_1.createProductList);
productRouter.route("/:listID/delete-list").delete(productController_1.deleteProductList);
// productRouter.route("/:userID/get-list").get(getLists);
// import express, { Router } from "express";import OrderController from "../controllers/OrderController";
// const router: Router = express.Router();
const orderController = new productController_1.default();
// productRouter.get("/daily", async (req, res) => {
//   const dailyOrders = await orderController.getDailyOrders();
//   res.json(dailyOrders);
// });
productRouter.get("/monthly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const monthlyOrders = yield orderController.getMonthlyOrders();
    res.json(monthlyOrders);
}));
// productRouter.get("/yearly", async (req, res) => {
//   const yearlyOrders = await orderController.getYearlyOrders();
//   res.json(yearlyOrders);
// });
// export default productRouter;
exports.default = productRouter;

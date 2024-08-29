"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const paymentRouter = (0, express_1.Router)();
paymentRouter.route("/make-payment").post(paymentController_1.makePayment);
paymentRouter.route("/verify-payment").post(paymentController_1.verifyPayment);
exports.default = paymentRouter;

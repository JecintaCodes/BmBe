"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const paymentRouter = (0, express_1.Router)();
paymentRouter.route("/make-payment").post(paymentController_1.makePayment);
paymentRouter.route("/verify-payment").post(paymentController_1.verifyPayment);
paymentRouter.route("/list-verify-payment").post(paymentController_1.verifyOrderListPayment);
paymentRouter.route("/list-make-payment").post(paymentController_1.makeListPayment);
// paymentRouter.route("/:userID/sub-acc").post(createSubaccount);
// paymentRouter.route("/:userID/split-payment").post(initializeSplitPayment);
// paymentRouter.route("/make-list-payment").post(makeOrderListPayment);
// paymentRouter.route("/verify-payment-list").post(verifyOrderListPayment);
// paymentRouter.route("/split-payment").post(splitPayment);
exports.default = paymentRouter;

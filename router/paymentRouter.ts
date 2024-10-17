import { Router } from "express";
import {
  makeOrderListPayment,
  verifyOrderListPayment,
  makePayment,
  verifyPayment,
} from "../controller/paymentController";

const paymentRouter = Router();

paymentRouter.route("/make-payment").post(makePayment);
paymentRouter.route("/verify-payment").post(verifyPayment);
// paymentRouter.route("/make-list-payment").post(makeOrderListPayment);
// paymentRouter.route("/verify-payment-list").post(verifyOrderListPayment);
// paymentRouter.route("/split-payment").post(splitPayment);

export default paymentRouter;

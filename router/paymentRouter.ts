import { Router } from "express";
import {
  makeListPayment,
  makePayment,
  makeServicePayment,
  verifyOrderListPayment,
  verifyPayment,
  verifyServicePayment,
} from "../controller/paymentController";

const paymentRouter = Router();

paymentRouter.route("/make-payment").post(makePayment);
paymentRouter.route("/verify-payment").post(verifyPayment);
paymentRouter.route("/list-verify-payment").post(verifyOrderListPayment);
paymentRouter.route("/list-make-payment").post(makeListPayment);
paymentRouter.route("/make-service-payment").post(makeServicePayment);
paymentRouter.route("/verify-service-payment").post(verifyServicePayment);

// paymentRouter.route("/:userID/sub-acc").post(createSubaccount);
// paymentRouter.route("/:userID/split-payment").post(initializeSplitPayment);
// paymentRouter.route("/make-list-payment").post(makeOrderListPayment);
// paymentRouter.route("/verify-payment-list").post(verifyOrderListPayment);
// paymentRouter.route("/split-payment").post(splitPayment);

export default paymentRouter;

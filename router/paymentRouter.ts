import { Router } from "express";
import {
  makeListPayment,
  makePayment,
  makeServicePayment,
  totalOrders,
  totalPayment,
  userTotalOrders,
  userTotalPayment,
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
paymentRouter.route("/total-order").get(totalOrders);
paymentRouter.route("/total-payment").get(totalPayment);
paymentRouter.route("/:userID/user-total-order").get(userTotalOrders);
paymentRouter.route("/:userID/user-total-payment").get(userTotalPayment);


// paymentRouter.route("/:userID/sub-acc").post(createSubaccount);
// paymentRouter.route("/:userID/split-payment").post(initializeSplitPayment);
// paymentRouter.route("/make-list-payment").post(makeOrderListPayment);
// paymentRouter.route("/verify-payment-list").post(verifyOrderListPayment);
// paymentRouter.route("/split-payment").post(splitPayment);

export default paymentRouter;

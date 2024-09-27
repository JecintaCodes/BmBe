import { Router } from "express";
import {
  makePayment,
  splitPayment,
  verifyPayment,
} from "../controller/paymentController";

const paymentRouter = Router();

paymentRouter.route("/make-payment").post(makePayment);
paymentRouter.route("/verify-payment").post(verifyPayment);
// paymentRouter.route("/split-payment").post(splitPayment);

export default paymentRouter;

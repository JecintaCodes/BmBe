import { Router } from "express";
import { makePayment, verifyPayment } from "../controller/paymentController";

const paymentRouter = Router();

paymentRouter.route("/make-payment").post(makePayment);
paymentRouter.route("/verify-payment").post(verifyPayment);

export default paymentRouter;

import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import axios from "axios";
import env from "dotenv";
import paymentModel from "../model/paymentModel";
env.config();

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { amount, email } = req.body;
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const url: string = `https://api.paystack.co/transaction/initialize`;

    const params = JSON.stringify({
      email,
      amount: `${parseInt(amount) * 100}`,
      callback_url: `http://localhost:5173/verify-payment`,
      metadata: {
        cancel_action: "http://localhost:5173/product",
      },
    });

    const result = await axios.post(url, params, config).then((res) => {
      return res.data.data;
    });
    return res.status(HTTP.CREATED).json({
      message: "sucessfully make payment",
      data: result,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error making payment ${error}`,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { refNumb } = req.body;
    //checking duplicate refNumb
    // const checkRefNumb = paymentModel.findOne({ reference: refNumb });
    // if (checkRefNumb === refNumb) {
    // }
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
    //api.paystack.co/transaction/verify/:reference

    const result = await axios.get(url, config).then((res) => {
      return res.data.data;
      console.log(res.data.data.gateway_response);
      console.log(res.data.data.status);
    });
    return res.status(HTTP.CREATED).json({
      message: "ur payment is successful",
      data: result,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error making payment ${error}`,
    });
  }
};

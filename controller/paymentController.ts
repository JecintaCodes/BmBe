import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import axios from "axios";
import env from "dotenv";
import paymentModel from "../model/paymentModel";
import userMode from "../model/userMode";
import productModel from "../model/productModel";
import orderModel from "../model/orderModel";
import { Types, startSession } from "mongoose";
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
      callback_url: `https://boundary-market1.web.app/verify-payment`,
      // callback_url: `http://localhost:5173/verify-payment`,
      metadata: {
        cancel_action: "https://boundary-market1.web.app/product",
        // cancel_action: "http://localhost:5173/product",
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
    const { refNumb, amount, email, userID } = req.body;

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;

    const user = await userMode.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //check for duplcate
    const checkDuplicate = await paymentModel.findOne({ refNumb });

    if (checkDuplicate) {
      return res.status(404).json({
        message: "Duplicate reference id",
      });
    }

    const result = await axios.get(url, config).then((res) => {
      return res.data.data;
    });
    console.log(result);
    // Save payment data to database
    const session = await startSession();

    const paymentData = new paymentModel({
      refNumb,
      email,
      address: user?.address,
      phoneNumb: user?.telNumb,
      amount: result?.amount / 100,
      status: result?.status,
      user: user._id,
    });
    paymentData?.users?.push(new Types.ObjectId(userID?._id));
    await paymentData.save();
    // user?.payments.push(new Types.ObjectId(paymentData?._id))
    // console.log(paymentData);

    const order = new orderModel({
      //  title: product.title,
      productOwner: user?._id,
      amount: paymentData.amount,
      address: user?.address,
      amountPaid: paymentData?.amount,
    });
    // order.users.push(new Types.ObjectId(user?._id))
    // user?.order?.push(new Types.ObjectId(order))
    await order.save();

    return res.status(HTTP.CREATED).json({
      message: "ur payment is successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error making payment ${error?.message}`,
    });
  }
};

// export const splitPayment = async (req: Request, res: Response) => {
//   try {
//     // const
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const { amount, email } = req.body;
//     const paystackAmount = amount * 0.01;
//     const platformAmount = amount * 0.1;
//     const customerAmount = amount - paystackAmount - platformAmount;

//     // Split payment between accounts
//     const paystackData = {
//       email,
//       amount: paystackAmount,
//       subaccount: "3187286773",
//       transaction_charge: paystackAmount,
//     };

//     const platformData = {
//       email,
//       amount: platformAmount,
//       subaccount: "9126124352",
//       bearer: "subaccount",
//     };

//     const customerData = {
//       email,
//       amount: customerAmount,
//       subaccount: "customer_account_id",
//       bearer: "subaccount",
//     };

//     const paystackResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       paystackData,
//       config
//     );
//     const platformResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       platformData,
//       config
//     );
//     const customerResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       customerData,
//       config
//     );

//     return res.status(HTTP.OK).json({
//       message: "payment successfully split",
//       data: {
//         paystack: paystackResult.data.data,
//         platform: platformResult.data.data,
//         customer: customerResult.data.data,
//       },
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error splitting payment ${error?.message}`,
//     });
//   }
// };

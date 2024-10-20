import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import axios from "axios";
import mongoose from "mongoose";
import env from "dotenv";
import paymentModel from "../model/paymentModel";
import userMode from "../model/userMode";
import orderModel from "../model/orderModel";
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

// export const verifyPayment = async (req: Request, res: Response) => {
//   try {
//     const { refNumb, amount, email, userID } = req.body;

//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };

//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;

//     const user = await userMode.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     //check for duplcate
//     const checkDuplicate = await paymentModel.findOne({ refNumb });

//     if (checkDuplicate) {
//       return res.status(404).json({
//         message: "Duplicate reference id",
//       });
//     }

//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     console.log(result);
//     // Save payment data to database
//     // const session = await startSession();

//     // const paymentData = new paymentModel({
//     //   refNumb,
//     //   email,
//     //   address: user?.address,
//     //   phoneNumb: user?.telNumb,
//     //   amount: result?.amount / 100,
//     //   status: result?.status,
//     //   user: user._id,
//     //   // QTYOrder,
//     // });
//     // paymentData?.users?.push(new Types.ObjectId(userID?._id));
//     // await paymentData.save();
//     // // user?.payments.push(new Types.ObjectId(paymentData?._id))
//     // // console.log(paymentData);

//     // const order = new orderModel({
//     //   productOwner: user?.name,
//     //   amount: paymentData.amount,
//     //   address: user?.address,
//     //   phoneNumb: paymentData?.phoneNumb,
//     //   amountPaid: paymentData?.amount,
//     //   QTYOrder: paymentData?.QTYOrder,
//     //   status: paymentData?.status,
//     //   user: user?._id, // Associate order with user
//     // });
//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }

//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       address: user.address,
//       phoneNumb: user.telNumb,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//     });
//     await paymentData.save();

//     // Create order
//     const order = new orderModel({
//       productOwner: user.name,
//       amount: paymentData.amount,
//       address: user.address,
//       phoneNumb: paymentData.phoneNumb,
//       amountPaid: paymentData.amount,
//       status: paymentData.status,
//       user: user._id,
//     });
//     await order.save();

//     // Update user document with new order ID
//     await userMode.findByIdAndUpdate(user._id, {
//       $addToSet: { orders: order._id },
//     });
//     // order?.users?.push(new Types.ObjectId(user?._id));
//     // await order.save();

//     // Update user document with new order ID
//     // await userMode.findByIdAndUpdate(user?._id, {
//     //   $addToSet: { orders: order._id },
//     // });

//     return res.status(HTTP.CREATED).json({
//       message: "ur payment is successful",
//       data: result,
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error making payment ${error?.message}`,
//     });
//   }
// };
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

    // Check for duplicate reference ID
    const checkDuplicate = await paymentModel.findOne({ refNumb });
    if (checkDuplicate) {
      return res.status(404).json({ message: "Duplicate reference ID" });
    }

    const result = await axios.get(url, config).then((res) => {
      return res.data.data;
    });

    // Validate payment data
    if (!result || result.status !== "success") {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // Generate unique delivery code
    let deliveryCode;
    do {
      deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (await orderModel.findOne({ deliveryCode }));

    // Save payment data to database
    const paymentData = new paymentModel({
      refNumb,
      email,
      address: user.address,
      phoneNumb: user?.telNumb,
      amount: result.amount / 100,
      status: result.status,
      user: user._id,
      customerCode: deliveryCode,
    });
    await paymentData.save();
    console.log(paymentData);
    // Create order
    const order = new orderModel({
      productOwner: user.name,
      amount: paymentData.amount,
      address: user.address,
      phoneNumb: paymentData.phoneNumb,
      amountPaid: paymentData.amount,
      status: paymentData.status,
      user: user._id,
      customerCode: paymentData?.customerCode,
    });
    await order.save();
    console.log(order);
    // Update user document with payment and order IDs
    await userMode.findByIdAndUpdate(user._id, {
      $addToSet: {
        payments: paymentData._id,
        orders: order._id,
      },
    });

    return res.status(201).json({
      message: "Payment successful",
      data: result,
      order: order,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: `Error making payment: ${error.message}`,
    });
  }
};

// export const verifyOrderListPayment = async (req: Request, res: Response) => {
//   try {
//     const {
//       lists,
//       customerCode,
//       title,
//       amount,
//       totalAmount,
//       refNumb,
//       email,
//       userID,
//     } = req.body;

//     const user = await userMode.findOne({ _id: userID });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };

//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;

//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });

//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }

//     // Check for duplicate customer code
//     const checkDuplicateOrder = await orderModel.findOne({ customerCode });
//     if (checkDuplicateOrder) {
//       return res.status(404).json({ message: "Duplicate customer code" });
//     }

//     // Check for duplicate reference ID
//     const checkDuplicatePayment = await paymentModel.findOne({ refNumb });
//     if (checkDuplicatePayment) {
//       return res.status(404).json({ message: "Duplicate reference ID" });
//     }

//     // Generate unique order code
//     let orderCode;
//     do {
//       orderCode = Math.floor(100000 + Math.random() * 900000).toString();
//     } while (await orderModel.findOne({ orderCode }));

//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email: user?.email,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//       customerCode: orderCode,
//     });
//     await paymentData.save();
//     // Create orders for each item
//     lists.forEach(async (item: any) => {
//       const { title, amount } = item;

//       // Check for duplicate customer code
//       const checkDuplicateOrder = await orderModel.findOne({ customerCode });
//       if (checkDuplicateOrder) {
//         return res.status(404).json({ message: "Duplicate customer code" });
//       }

//       // Generate unique order code
//       let orderCode;
//       do {
//         orderCode = Math.floor(100000 + Math.random() * 900000).toString();
//       } while (await orderModel.findOne({ orderCode }));

//       // Save order data to database
//       const orderData = new orderModel({
//         title,
//         amount,
//         totalAmount: paymentData?.amount,
//         user: user._id,
//         customerCode: paymentData?.customerCode,
//         payment: paymentData._id,
//         productOwner: user?.name,
//       });
//       await orderData.save();

//       // Update user document with order ID
//       await userMode.findByIdAndUpdate(user._id, {
//         $addToSet: {
//           orders: orderData._id,
//         },
//       });
//     });

//     // Save order data to database

//     // const orderData = new orderModel({
//     //   title,
//     //   amount,
//     //   totalAmount: paymentData?.amount,
//     //   user: user._id,
//     //   customerCode: paymentData?.customerCode,
//     //   payment: paymentData._id,
//     //   productOwner: user?.name,
//     // });
//     // await orderData.save();

//     // // Update user document with order and payment IDs
//     // await userMode.findByIdAndUpdate(user._id, {
//     //   $addToSet: {
//     //     orders: orderData._id,
//     //     payments: paymentData._id,
//     //   },
//     // });

//     return res.status(201).json({
//       message: "Orders and payment created successfully",
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error creating order and payment: ${error.message}`,
//     });
//   }
// };
// export const makeOrderListPayment = async (req: Request, res: Response) => {
//   try {
//     const { amount, email } = req.body;

//     // Validate input
//     if (!amount || !email) {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };

//     const url: string = `https://api.paystack.co/transaction/initialize`;

//     const params = JSON.stringify({
//       email,
//       amount: `${parseInt(amount) * 100}`,
//       callback_url: `http://localhost:5173/verify-payment-list`,
//       metadata: {
//         cancel_action: "http://localhost:5173/add-list",
//       },
//     });

//     const result = await axios.post(url, params, config);
//     console.log(result.data);

//     return res.status(201).json({
//       message: "Payment initialized successfully",
//       data: result.data.data,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error initializing payment: ${error.message}`,
//     });
//   }
// };
// export const verifyOrderListPayment = async (req: Request, res: Response) => {
//   try {
//     const {
//       lists,
//       customerCode,
//       title,
//       amount,
//       totalAmount,
//       refNumb,
//       email,
//       userID,
//     } = req.body;

//     // Validate input
//     // if ( !title || !amount || !refNumb || !email) {
//     //   return res.status(400).json({ message: "Invalid input" });
//     // }

//     const user = await userMode.findOne({ userID });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify payment
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };

//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;

//     // Generate unique delivery code
//     let deliveryCode;
//     do {
//       deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
//     } while (await orderModel.findOne({ deliveryCode }));

//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     console.log(result.data);

//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }

//     // Save payment data
//     const paymentData = new paymentModel({
//       refNumb,
//       email: user?.email,
//       amount: result?.amount,
//       status: "success",
//       user: user._id,
//       customerCode: deliveryCode,
//     });
//     await paymentData.save();

//     // Create orders for each item
//     lists.forEach(async (item: any) => {
//       const { title, amount } = item;

//       // Save order data
//       const orderData = new orderModel({
//         title,
//         amount,
//         totalAmount: paymentData?.amount,
//         user: user._id,
//         customerCode: paymentData?.customerCode,
//         payment: paymentData._id,
//         productOwner: user?.name,
//         email: paymentData?.email,
//       });
//       await orderData.save();

//       // Update user document with order ID
//       await userMode.findByIdAndUpdate(user._id, {
//         $addToSet: {
//           orders: orderData._id,
//           payments: paymentData._id,
//         },
//       });
//     });

//     return res.status(201).json({
//       message: "Orders and payment created successfully",
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error creating order and payment: ${error?.message}`,
//     });
//   }
// };
// {
// export const createOrderAndPayment = async (req: Request, res: Response) => {
//   try {
//     const { lists, refNumb, email, userID } = req.body;
//     const user = await userMode.findOne({ _id: userID });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Verify payment using Paystack's API
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }
//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//     });
//     await paymentData.save();
//     // Create orders for each item
//     lists.forEach(async (item) => {
//       const { title, amount, customerCode } = item;
//       // Check for duplicate customer code
//       const checkDuplicateOrder = await orderModel.findOne({ customerCode });
//       if (checkDuplicateOrder) {
//         return res.status(404).json({ message: "Duplicate customer code" });
//       }
//       // Generate unique order code
//       let orderCode;
//       do {
//         orderCode = Math.floor(100000 + Math.random() * 900000).toString();
//       } while (await orderModel.findOne({ orderCode }));
//       // Save order data to database
//       const orderData = new orderModel({
//         customerCode,
//         title,
//         amount,
//         user: user._id,
//         orderCode,
//         payment: paymentData._id,
//       });
//       await orderData.save();
//       // Update user document with order ID
//       await userMode.findByIdAndUpdate(user._id, {
//         $addToSet: {
//           orders: orderData._id,
//         },
//       });
//     });
//     return res.status(201).json({
//       message: "Orders and payment created successfully",
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error creating orders and payment: ${error.message}`,
//     });
//   }
// };
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
//     const paystackAmount = amount * 0.01;h
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
// }

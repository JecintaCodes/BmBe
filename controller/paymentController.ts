import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import axios from "axios";
import env from "dotenv";
import paymentModel from "../model/paymentModel";
import userMode from "../model/userMode";
import orderModel from "../model/orderModel";
import productModel from "../model/productModel";
import listModel from "../model/listModel";
import { Types } from "mongoose";
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
// export const makeListPayments = async (req: Request, res: Response) => {
//   try {
//     const { amount, email } = req.body;
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
//       // callback_url: `https://boundary-market1.web.app/verify-list-payment`,
//       callback_url: `http://localhost:5173/verify-list-payment`,
//       metadata: {
//         // cancel_action: "https://boundary-market1.web.app/add-list",
//         cancel_action: "http://localhost:5173/add-list",
//       },
//     });

//     const result = await axios.post(url, params, config).then((res) => {
//       return res.data.data;
//     });
//     return res.status(HTTP.CREATED).json({
//       message: "sucessfully make payment",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error making payment ${error}`,
//     });
//   }
// };
export const makeListPayment = async (req: Request, res: Response) => {
  try {
    const { amount, email } = req.body;

    // Define charge rates
    const chargeRates = {
      tier1: {
        minAmount: 0,
        maxAmount: 1000,
        chargePercentage: 0,
        chargeFlat: 100,
      },
      tier2: {
        minAmount: 1001,
        maxAmount: 10000,
        chargePercentage: 0,
        chargeFlat: 200,
      },
      tier3: {
        minAmount: 10001,
        maxAmount: 20000,
        chargePercentage: 0,
        chargeFlat: 300,
      },
      tier4: {
        minAmount: 20001,
        maxAmount: 30000,
        chargePercentage: 0,
        chargeFlat: 400,
      },
      tier5: {
        minAmount: 30001,
        maxAmount: 40000,
        chargePercentage: 0,
        chargeFlat: 500,
      },
      tier6: {
        minAmount: 40001,
        maxAmount: 50000,
        chargePercentage: 0,
        chargeFlat: 500,
      },
      tier7: {
        minAmount: 50001,
        maxAmount: 60000,
        chargePercentage: 0,
        chargeFlat: 600,
      },
      tier8: {
        minAmount: 60001,
        maxAmount: 70000,
        chargePercentage: 0,
        chargeFlat: 700,
      },
      tier9: {
        minAmount: 70001,
        maxAmount: 80000,
        chargePercentage: 0,
        chargeFlat: 800,
      },
      tier10: {
        minAmount: 80001,
        maxAmount: 90000,
        chargePercentage: 0,
        chargeFlat: 900,
      },
      tier11: {
        minAmount: 90001,
        maxAmount: Infinity,
        chargePercentage: 0.8,
        chargeFlat: 1000,
      },
    };

    // Calculate charge
    const calculateCharge = (amount: number) => {
      for (const tier of Object.values(chargeRates)) {
        if (amount >= tier.minAmount && amount <= tier.maxAmount) {
          return amount * (tier.chargePercentage / 100) + tier.chargeFlat;
        }
      }
      return 0;
    };

    // Calculate total charge
    const calculateTotalCharge = (amount: number) => {
      return calculateCharge(amount);
    };

    // Ensure amount is a number
    const amountValue: number = parseFloat(amount);

    if (isNaN(amountValue)) {
      throw new Error("Invalid amount");
    }

    const yourCharge = calculateCharge(amountValue);
    const totalCharge = calculateTotalCharge(amountValue);
    const totalAmount = amountValue + totalCharge;

    // Paystack API configuration
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const url: string = `https://api.paystack.co/transaction/initialize`;

    const params = JSON.stringify({
      email,
      amount: `${Math.floor(totalAmount * 100)}`,
      callback_url: `https://boundary-market1.web.app/verify-list-payment`,
      // callback_url: `http://localhost:5173/verify-list-payment`,
      metadata: {
        // cancel_action: "http://localhost:5173/add-list",
        cancel_action: "https://boundary-market1.web.app//add-list",
      },
    });

    const result = await axios.post(url, params, config).then((res) => {
      return res.data.data;
    });

    return res.status(HTTP.CREATED).json({
      message: "Successfully made payment",
      data: result,
      yourCharge: yourCharge.toFixed(2),
      totalCharge: totalCharge.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error making payment: ${error}`,
    });
  }
};
// export const makePayments = async (req: Request, res: Response) => {
//   try {
//     const { amount, email, productIDs } = req.body;

//     // Validate product IDs
//     if (!Array.isArray(productIDs) || productIDs.length === 0) {
//       return res.status(400).json({
//         message: "Invalid product IDs",
//       });
//     }

//     // Find products
//     const products = await productModel.find({ _id: { $in: productIDs } });

//     if (products.length === 0) {
//       return res.status(404).json({
//         message: "Products not found",
//       });
//     }

//     // Process each product
//     for (const product of products) {
//       // Find the owner of the product
//       const owner = await userMode.findById(product.userID);

//       if (!owner) {
//         console.error(`Owner not found for product ${product._id}`);
//         continue;
//       }

//       if (!owner.subAccountCode) {
//         console.error(`Owner ${owner.email} does not have a subaccount code`);
//         continue;
//       }

//       // Calculate earnings for the owner
//       const ownerEarnings = product.amount;

//       // Create payment object
//       const payment = {
//         email: owner.email,
//         amount: ownerEarnings * 100,
//         subaccount: owner.subAccountCode,
//       };

//       console.log(`Payment for ${owner.email}:`, payment);

//       // Process payment
//       const paystackKey = process.env.PAYSTACKKEY;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${paystackKey}`,
//           "Content-Type": "application/json",
//         },
//       };

//       const params = {
//         ...payment,
//         callback_url: `https://boundary-market1.web.app/verify-payment`,
//         metadata: {
//           cancel_action: `https://boundary-market1.web.app/product`,
//           product_ids: productIDs,
//         },
//       };

//       const url = "https://api.paystack.co/transaction/initialize";
//       try {
//         const result = await axios.post(url, params, config);
//         console.log(`Payment result for ${owner.email}:`, result.data);
//       } catch (error: any) {
//         console.error(
//           `Paystack API Error for ${owner.email}:`,
//           error.response?.data
//         );
//         return res.status(500).json({
//           message: `Error processing payment for ${payment.email}: ${error.message}`,
//         });
//       }
//     }

//     return res.status(201).json({
//       message: "Successfully made payment",
//     });
//   } catch (error: any) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       message: `Error processing payment: ${error.message}`,
//     });
//   }
// };

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

// try {
//   const { refNumb, amount, email, userID } = req.body;

//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//       "Content-Type": "application/json",
//     },
//   };

//   const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;

//   const user = await userMode.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Check for duplicate reference ID
//   const checkDuplicate = await paymentModel.findOne({ refNumb });
//   if (checkDuplicate) {
//     return res.status(404).json({ message: "Duplicate reference ID" });
//   }

//   // const subaccountCode = user?.subAccountCode;
//   // const params = {
//   //   email: user.email,
//   //   amount: parseInt(amount) * 100,
//   //   subaccount: subaccountCode,
//   // };

//   const result = await axios.get(url, config).then((res) => {
//     return res.data.data;
//   });

//   // Validate payment data
//   if (!result || result.status !== "success") {
//     return res.status(400).json({ message: "Invalid payment data" });
//   }

//   // Generate unique delivery code
//   let deliveryCode;
//   do {
//     deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
//   } while (await orderModel.findOne({ deliveryCode }));

//   // Save payment data to database
//   const paymentData = new paymentModel({
//     refNumb,
//     email,
//     address: user.address,
//     phoneNumb: user?.telNumb,
//     amount: result.amount / 100,
//     status: result.status,
//     user: user._id,
//     customerCode: deliveryCode,
//   });
//   await paymentData.save();
//   console.log(paymentData);
//   // Create order
//   const order = new orderModel({
//     productOwner: user.name,
//     amount: paymentData.amount,
//     address: user.address,
//     phoneNumb: paymentData.phoneNumb,
//     amountPaid: paymentData.amount,
//     status: paymentData.status,
//     user: user._id,
//     customerCode: paymentData?.customerCode,
//   });
//   await order.save();
//   console.log(order);
//   // Update user document with payment and order IDs
//   await userMode.findByIdAndUpdate(user._id, {
//     $addToSet: {
//       payments: paymentData._id,
//       orders: order._id,
//     },
//   });

//   return res.status(201).json({
//     message: "Payment successful",
//     data: result.data,
//     order: order,
//   });
// } catch (error: any) {
//   console.error(error);
//   return res.status(400).json({
//     message: `Error making payment: ${error.message}`,
//   });
// }
// };

// export const initializeSplitPayment = async (req: Request, res: Response) => {
//   try {
//     const paystackKey = process.env.PAYSTACKKEY;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${paystackKey}`,
//       },
//     };
//     const { userID } = req.params;
//     const { amount } = req.body;

//     const user = await userMode.findById(userID);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const subaccountCode = user?.subAccountCode;
//     const params = {
//       email: user.email,
//       amount: parseInt(amount) * 100,
//       subaccount: subaccountCode,
//     };

//     const url = `https://api.paystack.co/transaction/initialize`;
//     const response = await axios.post(url, params, config);

//     return res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Failed to initialize split payment" });
//   }
// };
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { refNumb, amount, email, productIDs, quantities } = req.body;

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

    // Find products
    const products = await productModel.find({ _id: { $in: productIDs } });

    // Split payment among product owners
    const splitPayments = await Promise.all(
      products.map(async (product, index) => {
        const owner = await userMode.findById(product.userID);
        if (!owner || !owner.subAccountCode) {
          throw new Error(
            `Owner or subaccount code not found for product ${product._id}`
          );
        }

        const quantity = quantities[index];
        if (typeof quantity !== "number" || quantity <= 0) {
          throw new Error(`Invalid quantity for product ${product._id}`);
        }

        const productAmount = product.amount * quantity;
        if (isNaN(productAmount)) {
          throw new Error(`Invalid product amount for product ${product._id}`);
        }

        // Return split payment details
        return {
          subaccount: owner.subAccountCode,
          amount: productAmount,
          platformFee: productAmount * 0.1, // 10% platform fee
        };
      })
    );
    //give customer unique code
    function generateOrderCode(length = 8) {
      let code = "";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          code += letters.charAt(Math.floor(Math.random() * letters.length));
        } else {
          code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
      }
      return code;
    }
    const customerCode = generateOrderCode(8);
    // Save payment data to database
    const paymentData = new paymentModel({
      refNumb,
      email,
      address: user?.address,
      phoneNumb: user?.telNumb,
      amount: result?.amount / 100,
      status: result?.status,
      user: user?._id,
      splitPayments: splitPayments,
      customerCode: customerCode,
    });
    await paymentData.save();

    // Create order
    // const order = new orderModel({
    //   title: "Order", // Required field
    //   productOwner: user.name,
    //   status: "pending",
    //   phoneNumb: paymentData.phoneNumb,
    //   img: "", // Required field
    //   totalAmount: amount,
    //   amountPaid: amount,
    //   QTYOrder: quantities.reduce((acc: number, quantity: number) => {
    //     return acc + quantity;
    //   }, 0),
    //   address: user.address,
    //   date: new Date(),
    //   category: "", // Required field
    //   productDetails: products.map((product, index) => {
    //     const splitPayment = splitPayments.find(
    //       (split) => split?.subaccount === product.userID
    //     );
    //     return {
    //       productID: product._id,
    //       quantity: quantities[index],
    //       amount: product.amount * quantities[index],
    //       platformFee: splitPayment?.platformFee ?? 0,
    //       amountAfterFee: splitPayment?.amount ?? 0,
    //     };
    //   }),
    //   users: user._id,
    //   payments: [paymentData._id],
    //   splitPayments: paymentData?.splitPayments,
    // });
    // // Update user document with payment and order IDs
    // await userMode.findByIdAndUpdate(user._id, {
    //   $addToSet: {
    //     payments: paymentData._id,
    //     orders: order._id,
    //   },
    // });

    // Create order
    const order = new orderModel({
      title: "Order", // Required field
      productOwner: user.name,
      status: paymentData?.status,
      phoneNumb: paymentData.phoneNumb,
      img: "", // Required field
      totalAmount: amount,
      amountPaid: amount,
      customerCode: paymentData?.customerCode,
      // QTYOrder: quantities.reduce((acc: number, quantity: number) => {
      //   return acc + quantity;
      // }, 0),
      address: user.address,
      date: new Date(),
      category: "", // Required field
      productDetails: products.map((product, index) => {
        const splitPayment = splitPayments.find(
          (split) => split?.subaccount === product.userID
        );
        return {
          productID: product._id,
          quantity: quantities[index],
          amount: product.amount * quantities[index],
          platformFee: splitPayment?.platformFee ?? 0,
          amountAfterFee: splitPayment?.amount ?? 0,
        };
      }),
      users: user._id,
      payments: [paymentData._id],
      splitPayments: paymentData?.splitPayments,
    });

    // Save order to database
    await order.save();

    // Update user document with payment and order IDs
    await userMode.findByIdAndUpdate(user._id, {
      $addToSet: {
        payments: paymentData._id,
        orders: order._id,
      },
    });

    return res.status(201).json({
      message: "Payment successful",
      paystackData: result, // Paystack transaction data
      splitPayments: paymentData.splitPayments, // Split payment data
      order: order,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: `Error making payment: ${error.message}`,
    });
  }
};

export const verifyOrderListPayments = async (req: Request, res: Response) => {
  try {
    const { lists, refNumb, userID } = req.body;

    // Validate lists array
    if (!lists || !Array.isArray(lists)) {
      return res.status(400).json({ message: "Invalid lists array" });
    }

    // Find user by ID
    const user = await userMode.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify payment transaction
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
    const result = await axios.get(url, config).then((res) => {
      return res.data.data;
    });

    // Validate payment data
    if (!result || result.status !== "success") {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    //generate customer code
    let generatedCustomerCode: string;
    do {
      generatedCustomerCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
    } while (await orderModel.findOne({ customerCode: generatedCustomerCode }));

    // Update user document with customerCode
    await userMode.findByIdAndUpdate(user._id, {
      customerCode: generatedCustomerCode,
    });

    // Update existing payment document or create a new one
    const existingPayment = await paymentModel.findOne({ refNumb });
    let paymentData;
    if (existingPayment) {
      paymentData = await paymentModel.findOneAndUpdate(
        { refNumb },
        {
          $set: {
            email: user?.email,
            amount: result.amount / 100,
            status: result.status,
            user: user._id,
            address: user?.address,
            phoneNumb: user?.telNumb,
            customerCode: generatedCustomerCode,
          },
        },
        { new: true, upsert: true } // Update or create if not exists
      );
      paymentData = existingPayment;
    } else {
      paymentData = new paymentModel({
        refNumb,
        email: user?.email,
        amount: result.amount / 100,
        status: result.status,
        userID: user._id,
        address: user?.address,
        phoneNumb: user?.telNumb,
        customerCode: generatedCustomerCode,
      });
      await paymentData.save();
    }

    // Check if order already exists based on customerCode and userID
    const existingOrder = await orderModel.findOne({
      customerCode: paymentData.customerCode,
      userID: user._id,
    });

    if (existingOrder) {
      // Update the existing order by adding new lists and adjusting totalAmount
      await orderModel.findByIdAndUpdate(existingOrder._id, {
        $set: { status: paymentData.status }, // Update status
        $inc: { totalAmount: paymentData.amount }, // Increment total amount
        $addToSet: { lists: { $each: lists }, payments: paymentData._id }, // Add lists & payment
      });

      return res
        .status(200)
        .json({ message: "Order updated successfully", order: existingOrder });
    } else {
      // Create a new order
      const orderData = new orderModel({
        title: "Customer Order",
        email: paymentData.email,
        customerCode: paymentData.customerCode,
        userID: paymentData.userID,
        totalAmount: paymentData.amount,
        lists,
        payments: [paymentData._id],
        productOwner: user.name,
        status: paymentData.status,
        address: paymentData.address,
        phoneNumb: paymentData.phoneNumb,
      });
      await orderData.save();

      // Update user document with the order and payment IDs
      await userMode.findByIdAndUpdate(user._id, {
        $addToSet: {
          orders: orderData._id,
          payments: paymentData._id,
        },
      });
    }

    // Calculate total amount
    const totalAmounts = lists.reduce((acc, item) => acc + item.amount, 0);

    // Check for existing list before creating a new one
    const existingList = await listModel.findOne({ refNumb });
    if (existingList) {
      // Update existing list
      // Update or create the list based on refNumb
      await listModel.findOneAndUpdate(
        { refNumb },
        {
          title: "Order List",
          email: user.email,
          amount: totalAmounts,
          totalAmount: totalAmounts,
          customerCode: paymentData.customerCode,
          userID: paymentData.userID,
          orders: lists.map((item) => new Types.ObjectId(item._id)),
          lists: lists.map((item) => ({
            amount: item.amount,
            title: item.title,
          })),
        },
        { new: true, upsert: true }
      );
    } else {
      // Create new list
      const listData = new listModel({
        refNumb,
        title: "Order List",
        email: user.email,
        amount: totalAmounts,
        totalAmount: totalAmounts,
        customerCode: paymentData?.customerCode,
        userID: paymentData?.userID,
        orders: lists?.map((item) => new Types.ObjectId(item._id)),
        lists: lists?.map((item) => ({
          amount: item.amount,
          title: item.title,
        })),
      });
      await listData.save();
    }

    // Return response with order details
    return res.status(201).json({
      message: "Orders and payment created successfully",
      orderDetails: {
        customerCode: paymentData.customerCode,
        totalAmountPaid: paymentData.amount,
        orders: lists.map((item) => ({
          title: item.title,
          amount: item.amount,
        })),
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: `Error creating order and payment: ${error.message}`,
    });
  }
};
export const verifyOrderListPayment = async (req: Request, res: Response) => {
  try {
    const { lists, refNumb, userID } = req.body;

    // Validate lists array
    if (!lists || !Array.isArray(lists)) {
      return res.status(400).json({ message: "Invalid lists array" });
    }

    // Find user by ID
    const user = await userMode.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify payment transaction
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
        "Content-Type": "application/json",
      },
    };

    const {
      data: { data: result },
    } = await axios.get(
      `https://api.paystack.co/transaction/verify/${refNumb}`,
      config
    );

    // Validate payment data
    if (!result || result.status !== "success") {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // Generate unique customer code
    let generatedCustomerCode;
    do {
      generatedCustomerCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
    } while (await orderModel.findOne({ customerCode: generatedCustomerCode }));

    // Update user document with customerCode
    await userMode.findByIdAndUpdate(user._id, {
      customerCode: generatedCustomerCode,
    });

    // Update or create payment document
    const existingPayment = await paymentModel.findOne({ refNumb });
    let paymentData = existingPayment
      ? await paymentModel.findOneAndUpdate(
          { refNumb },
          {
            email: user.email,
            amount: result.amount / 100,
            status: result.status,
            user: user._id,
            address: user.address,
            phoneNumb: user.telNumb,
            customerCode: generatedCustomerCode,
          },
          { new: true, upsert: true }
        )
      : await new paymentModel({
          refNumb,
          email: user.email,
          amount: result.amount / 100,
          status: result.status,
          userID: user._id,
          address: user.address,
          phoneNumb: user.telNumb,
          customerCode: generatedCustomerCode,
        }).save();

    // Check if an order already exists for this user
    const existingOrder = await orderModel.findOne({
      customerCode: paymentData.customerCode,
      userID: user._id,
    });

    if (existingOrder) {
      // Update existing order
      await orderModel.findByIdAndUpdate(existingOrder._id, {
        $set: { status: paymentData.status },
        $inc: { totalAmount: paymentData.amount },
        $addToSet: { lists: { $each: lists }, payments: paymentData._id },
      });
      return res.status(200).json({
        message: "Order updated successfully",
        order: existingOrder,
      });
    } else {
      // Create new order
      const orderData = new orderModel({
        title: "Customer Order",
        email: paymentData.email,
        customerCode: paymentData.customerCode,
        userID: paymentData.userID,
        totalAmount: paymentData.amount,
        lists,
        payments: [paymentData._id],
        productOwner: user.name,
        status: paymentData.status,
        address: paymentData.address,
        phoneNumb: paymentData.phoneNumb,
      });
      await orderData.save();

      // Add order and payment IDs to the user document
      await userMode.findByIdAndUpdate(user._id, {
        $addToSet: { order: orderData._id, payments: paymentData._id },
      });
    }

    // Calculate total amount for the list items
    const totalAmounts = lists.reduce((acc, item) => acc + item.amount, 0);

    // Check if list exists, if so, update; otherwise, create a new one
    const existingList = await listModel.findOne({ refNumb });
    if (existingList) {
      await listModel.findOneAndUpdate(
        { refNumb },
        {
          title: "Order List",
          email: user.email,
          amount: totalAmounts,
          totalAmount: totalAmounts,
          customerCode: paymentData.customerCode,
          userID: paymentData.userID,
          orders: lists.map((item) => new Types.ObjectId(item._id)),
          lists: lists.map((item) => ({
            amount: item.amount,
            title: item.title,
          })),
        },
        { new: true, upsert: true }
      );
    } else {
      const listData = new listModel({
        refNumb,
        title: "Order List",
        email: user.email,
        amount: totalAmounts,
        totalAmount: totalAmounts,
        customerCode: paymentData.customerCode,
        userID: paymentData.userID,
        orders: lists.map((item) => new Types.ObjectId(item._id)),
        lists: lists.map((item) => ({
          amount: item.amount,
          title: item.title,
        })),
      });
      await listData.save();
    }
    // Add order and payment IDs to the user document
    await userMode.findByIdAndUpdate(user._id, {
      $addToSet: { lists: user._id },
    });

    // Return response with order details
    return res.status(201).json({
      message: "Orders and payment created successfully",
      orderDetails: {
        customerCode: paymentData.customerCode,
        totalAmountPaid: paymentData.amount,
        orders: lists.map((item) => ({
          title: item.title,
          amount: item.amount,
        })),
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: `Error creating order and payment: ${error.message}`,
    });
  }
};

// export const verifyPaymented = async (req: Request, res: Response) => {
//   try {
//     const { refNumb, amount, email, productIDs } = req.body;

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

//     // Check for duplicate reference ID
//     const checkDuplicate = await paymentModel.findOne({ refNumb });
//     if (checkDuplicate) {
//       return res.status(404).json({ message: "Duplicate reference ID" });
//     }

//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });

//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }

//     // Find products
//     const products = await productModel.find({ _id: { $in: productIDs } });

//     // Split payment among product owners
//     const splitPayments = await Promise.all(
//       products
//         .map(async (product) => {
//           const owner = await userMode.findById(product.userID);
//           if (!owner) {
//             console.error(`Owner not found for product ${product._id}`);
//             return null;
//           }
//           if (!owner.subAccountCode) {
//             console.error(
//               `Owner ${owner.email} does not have a subaccount code`
//             );
//             return null;
//           }
//           return {
//             subaccount: owner.subAccountCode,
//             amount: product.amount,
//           };
//         })
//         .filter(Boolean)
//     );

//     // Deduct platform fee
//     const totalAmount = products.reduce(
//       (acc, product) => acc + product.amount,
//       0
//     );
//     const platformFee = totalAmount * 0.1; // 10% platform fee
//     const netAmount = totalAmount - platformFee;

//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       address: user.address,
//       phoneNumb: user?.telNumb,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//       splitPayments,
//       platformFee,
//       netAmount,
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
//       splitPayments,
//     });
//     await order.save();

//     // Update user document with payment and order IDs
//     await userMode.findByIdAndUpdate(user._id, {
//       $addToSet: {
//         payments: paymentData._id,
//         orders: order._id,
//       },
//     });

//     return res.status(201).json({
//       message: "Payment successful",
//       paystackData: result, // Paystack transaction data
//       // splitPayments: paymentData.splitPayments, // Split payment data
//       order: order,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error making payment: ${error.message}`,
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

// export const splitPayment = (req: Request, res: Response) => {
//   try {
//     const { email, amount } = req.params;
//     //create a subAccount
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//         business_name: "Onyemaobi Ugochi Jecinta",
//         bank_code: "011",
//         account_number: "3187286773",
//         percentage_charge: 11,
//       },
//     };

//     const url = `https://api.paystack.co/subaccount`;

//     //initialize a split payment
//     const params = JSON.stringify({
//       email,
//       amount: `${parseInt(amount) * 100}`,
//       subaccount: "ACCT_xxxxxxxxx",
//     });
//  const url = `https://api.paystack.co/transaction/initialize`,

//   } catch (error) {}
// };

// export const splitPayment = async (req: Request, res: Response) => {
//   try {
//     // Ensure email and amount are provided
//     const { email, amount } = req.params;
//     // if (!email || !amount) {
//     //   return res.status(400).json({ message: 'Email and amount are required' });
//     // }

//     // Create a subaccount
//     const subaccountConfig = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//       business_name: "Onyemaobi Ugochi Jecinta",
//       bank_code: "011",
//       account_number: "3187286773",
//       percentage_charge: 11,
//     };

//     const subaccountUrl = `https://api.paystack.co/subaccount`;
//     const subaccountResponse = await axios.post(
//       subaccountUrl,
//       subaccountConfig,
//       {
//         headers: subaccountConfig.headers,
//       }
//     );

//     // Initialize a split payment
//     const initializeConfig = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const initializeParams = {
//       email,
//       amount: parseInt(amount) * 100,
//       subaccount: "ACCT_xxxxxxxxx",
//     };
//     const initializeUrl = `https://api.paystack.co/transaction/initialize`;
//     const initializeResponse = await axios.post(
//       initializeUrl,
//       initializeParams,
//       {
//         headers: initializeConfig.headers,
//       }
//     );

//     // Return the response
//     const result = await axios
//       .post(subaccountResponse, initializeResponse)
//       .then((res) => {
//         return res.data.data;
//       });
//     return res.status(HTTP.CREATED).json({
//       message: "successfully splited your payment",
//       data: result,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(HTTP.BAD_REQUEST)
//       .json({ message: "Failed to split payment" });
//   }
// };

// export const createSubaccount = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;

//     const user = await userMode.findById(userID);

//     if (!user) {
//       console.log("user not found");
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const data = {
//       business_name: user?.name,
//       bank_code: user?.bankCode,
//       account_number: user?.accountNumb,
//       percentage_charge: 11,
//     };

//     const url = `https://api.paystack.co/subaccount`;
//     const response = await axios
//       .post(url, data, { headers: config.headers })
//       .then((res) => {
//         return res.data.data;
//       });

//     return res.status(HTTP.CREATED).json({
//       message: "successfully created sub account",
//       data: response,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to create subaccount" });
//   }
// };

// Initializes a split payment on Paystack

// export const initializeSplitPayment = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { amount } = req.body;
//     const user = await userMode.findById(userID);

//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const params = {
//       email: user?.email,
//       amount: parseInt(amount) * 100,
//       subaccount: user?.bankName,
//     };

//     const url = `https://api.paystack.co/transaction/initialize`;
//     const response = await axios.post(url, params, { headers: config.headers });

//     return res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Failed to initialize split payment" });
//   }
// };;

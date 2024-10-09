"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.makePayment = void 0;
const mainError_1 = require("../error/mainError");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const paymentModel_1 = __importDefault(require("../model/paymentModel"));
const userMode_1 = __importDefault(require("../model/userMode"));
const orderModel_1 = __importDefault(require("../model/orderModel"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, email } = req.body;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/initialize`;
        const params = JSON.stringify({
            email,
            amount: `${parseInt(amount) * 100}`,
            // callback_url: `https://boundary-market.web.app/verify-payment`,
            callback_url: `http://localhost:5173/verify-payment`,
            metadata: {
                // cancel_action: "https://boundary-market.web.app/product",
                cancel_action: "http://localhost:5173/product",
            },
        });
        const result = yield axios_1.default.post(url, params, config).then((res) => {
            return res.data.data;
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "sucessfully make payment",
            data: result,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error making payment ${error}`,
        });
    }
});
exports.makePayment = makePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { refNumb, amount, email, userID } = req.body;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/verify/${refNumb}`;
        const user = yield userMode_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //check for duplcate
        const checkDuplicate = yield paymentModel_1.default.findOne({ refNumb });
        if (checkDuplicate) {
            return res.status(404).json({
                message: "Duplicate reference id",
            });
        }
        const result = yield axios_1.default.get(url, config).then((res) => {
            return res.data.data;
        });
        console.log(result);
        // Save payment data to database
        const session = yield (0, mongoose_1.startSession)();
        const paymentData = new paymentModel_1.default({
            refNumb,
            email,
            address: user === null || user === void 0 ? void 0 : user.address,
            phoneNumb: user === null || user === void 0 ? void 0 : user.telNumb,
            amount: (result === null || result === void 0 ? void 0 : result.amount) / 100,
            status: result === null || result === void 0 ? void 0 : result.status,
            user: user._id,
        });
        (_a = paymentData === null || paymentData === void 0 ? void 0 : paymentData.users) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.Types.ObjectId(userID === null || userID === void 0 ? void 0 : userID._id));
        yield paymentData.save();
        // user?.payments.push(new Types.ObjectId(paymentData?._id))
        // console.log(paymentData);
        const order = new orderModel_1.default({
            //  title: product.title,
            productOwner: user === null || user === void 0 ? void 0 : user._id,
            amount: paymentData.amount,
            address: user === null || user === void 0 ? void 0 : user.address,
            amountPaid: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
        });
        // order.users.push(new Types.ObjectId(user?._id))
        // user?.order?.push(new Types.ObjectId(order))
        yield order.save();
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "ur payment is successful",
            data: result,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error making payment ${error === null || error === void 0 ? void 0 : error.message}`,
        });
    }
});
exports.verifyPayment = verifyPayment;
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

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
            callback_url: `http://localhost:5173/verify-payment`,
            metadata: {
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
        const url = `https://api.paystack.co/transaction/verify/${refNumb}`;
        //api.paystack.co/transaction/verify/:reference
        const result = yield axios_1.default.get(url, config).then((res) => {
            return res.data.data;
            console.log(res.data.data.gateway_response);
            console.log(res.data.data.status);
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "ur payment is successful",
            data: result,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error making payment ${error}`,
        });
    }
});
exports.verifyPayment = verifyPayment;

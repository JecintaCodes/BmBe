"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const orderModel = new mongoose_1.Schema({
    title: {
        type: String,
        required: true, // Changed 'require' to 'required'
    },
    productOwner: {
        type: String,
    },
    status: {
        type: String,
    },
    phoneNumb: {
        type: String,
    },
    img: {
        type: String,
    },
    description: {
        type: String,
    },
    email: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    amountPaid: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
        get: (value) => {
            return (0, moment_1.default)(value).format("YYYY-MM-DD");
        },
    },
    time: {
        type: String,
        default: () => {
            return (0, moment_1.default)().format("HH:mm:ss");
        },
    },
    customerCode: {
        type: String,
    },
    address: {
        type: String,
    },
    category: {
        type: String,
    },
    QTYOrder: {
        type: Number,
        default: 0,
    },
    productDetails: [
        {
            productID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
            amount: { type: Number },
            platformFee: { type: Number },
            amountAfterFee: { type: Number },
        },
    ],
    users: {
        type: mongoose_1.Types.ObjectId,
        ref: "users",
    },
    payments: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "payments",
        },
    ],
    splitPayments: [
        {
            subaccount: String,
            amount: Number,
            platformFee: Number,
        },
    ],
    lists: [
        {
            productID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            title: { type: String },
            amount: { type: Number },
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("orders", orderModel);

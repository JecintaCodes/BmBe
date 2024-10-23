"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
    totalAmount: {
        type: Number,
    },
    amountPaid: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now, // Added default date
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
            type: mongoose_1.Types.ObjectId,
            ref: "lists",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("orders", orderModel);

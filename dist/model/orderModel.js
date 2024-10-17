"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderModel = new mongoose_1.Schema({
    title: {
        type: String,
        require: true,
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
    lists: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "lists",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("orders", orderModel);

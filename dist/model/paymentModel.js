"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentModel = new mongoose_1.Schema({
    refNumb: {
        type: String,
    },
    email: {
        type: String,
    },
    status: {
        type: String,
    },
    userID: {
        type: String,
    },
    phoneNumb: {
        type: String,
    },
    address: {
        type: String,
    },
    amount: {
        type: Number,
    },
    users: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "users",
        },
    ],
    products: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "prosucts",
        },
    ],
    orders: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("payments", paymentModel);

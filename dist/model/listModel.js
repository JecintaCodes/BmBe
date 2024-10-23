"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listModel = new mongoose_1.Schema({
    refNumb: {
        type: String,
    },
    title: {
        type: String,
        required: true, // Required field
    },
    email: {
        type: String,
    },
    status: {
        type: String,
    },
    customerCode: {
        type: String,
    },
    amount: {
        type: Number,
        required: true, // Required field
    },
    totalAmount: {
        type: Number,
    },
    userID: {
        type: mongoose_1.Types.ObjectId,
        ref: "users", // Assuming your user model is named "users"
        index: true, // Index for efficient querying
    },
    orders: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders", // Assuming your order model is named "orders"
        },
    ],
    lists: [
        {
            amount: { type: Number, required: true }, // Validate amount
            title: { type: String, required: true }, // Validate title
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("lists", listModel);

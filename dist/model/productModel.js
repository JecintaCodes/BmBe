"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productModel = new mongoose_1.Schema({
    title: {
        type: String,
        require: true,
    },
    userID: {
        type: String,
    },
    postBy: {
        type: String,
    },
    img: {
        type: String,
    },
    // accountNumber: {
    //   type: String,
    // },
    description: {
        type: String,
    },
    storeID: {
        type: String,
    },
    amount: {
        type: Number,
        require: true,
    },
    toggle: {
        type: Boolean,
        default: false,
    },
    QTYinStock: {
        type: Number,
        default: 1,
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("prods", productModel);

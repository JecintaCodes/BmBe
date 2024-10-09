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
    orderOwner: {
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
    amountPaid: {
        type: Number,
    },
    address: {
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("orders", orderModel);

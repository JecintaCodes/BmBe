"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// interface iUser {
//   name: string;
//   email: string;
//   role: string;
//   image?: string;
//   imageID?: string;
//   password: string;
//   secretCode: string;
//   bankName: string;
//   bankCode?: string;
//   subAccountCode: string;
//   address: string;
//   accountNumb: string;
//   description?: string;
//   telNumb?: string;
//   products: {}[];
//   myStore: [];
//   order: {}[];
//   verify: boolean;
//   verifyToken: string;
//   verifyTokenExp: string;
//   lists: {}[];
//   payments: {}[];
// }
// interface iUserData extends iUser, Document {}
const userModel = new mongoose_1.Schema({
    address: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    telNumb: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
    },
    subAccountCode: {
        type: String,
    },
    verifyTokenExp: {
        type: String,
    },
    accountNumb: {
        type: String,
    },
    bankName: {
        type: String,
    },
    bankCode: {
        type: String,
    },
    verifyToken: {
        type: String,
    },
    image: {
        type: String,
    },
    imageID: {
        type: String,
    },
    description: {
        type: String,
    },
    secretCode: {
        type: String,
        require: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    myStore: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "prods",
        },
    ],
    lists: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "lists",
        },
    ],
    order: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders",
        },
    ],
    payments: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "payments",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("users", userModel);

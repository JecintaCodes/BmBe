"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listModel = new mongoose_1.Schema({
    title: {
        type: String,
    },
    amount: {
        type: Number,
    },
    userID: {
        type: mongoose_1.Types.ObjectId,
        ref: "users", // Assuming your user model is named "users"
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("lists", listModel);

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
        type: String,
    },
}, 
//   users: [
//       {
//         type: Types.ObjectId,
//         ref: "users",
//       },
//     ],
//   },
{ timestamps: true });
exports.default = (0, mongoose_1.model)("lists", listModel);

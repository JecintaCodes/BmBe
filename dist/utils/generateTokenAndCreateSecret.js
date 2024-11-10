"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSecretCode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateTokenAndSecretCode = (res, userID) => {
    var _a;
    if (!userID) {
        res.status(400).send("User ID is required");
        return;
    }
    try {
        const token = jsonwebtoken_1.default.sign({ userID }, (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JSON_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return token;
    }
    catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Error generating token");
    }
};
exports.generateTokenAndSecretCode = generateTokenAndSecretCode;
// import { Response } from "express";
// import jwt from "jsonwebtoken";
// import env from "dotenv";
// env.config();
// import { iUserData } from "./interface";
// // should be type annotated
// // const userId: string | undefined = iUserData?._id;
// export const generateTokenAndSecretCode = (res: Response, userID: string) => {
//   const token = jwt.sign({ userID }, process?.env.JSON_SECRET!, {
//     expiresIn: "7d",
//   });
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
//   return token;
// };

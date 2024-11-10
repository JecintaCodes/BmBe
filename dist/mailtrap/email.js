"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.transport = exports.sendVerificationEmail = void 0;
const Nodemailer = __importStar(require("nodemailer"));
const mailtrap_1 = require("mailtrap");
const emailTemplate_1 = require("./emailTemplate");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.TOKEN || !process.env.ENDPOINT) {
    throw new Error("Mailtrap token and endpoint environment variables are required");
}
const transport = Nodemailer.createTransport((0, mailtrap_1.MailtrapTransport)({
    token: process.env.TOKEN,
    // endpoint: process.env.ENDPOINT,
}));
exports.transport = transport;
const sender = {
    address: "hello@demomailtrap.com",
    name: "Boundary-Market",
};
exports.sender = sender;
const sendVerificationEmail = (user, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = user === null || user === void 0 ? void 0 : user.email;
    try {
        const response = yield transport.sendMail({
            from: sender,
            to: recipient,
            subject: "Verify your Mail",
            html: emailTemplate_1.VERIFICATIONEMAILtEMPLATE.replace("{verifyToken}", verificationToken)
                .replace("{name}", user === null || user === void 0 ? void 0 : user.name) // Replace {username} with user's name
                .replace("{verificationLink}", `http://localhost:2003/api/v1/verify/${verificationToken}`), // Replace {verificationLink} with actual link
            category: "Email Verification Successful",
        });
        console.log("email sent successfully", response);
    }
    catch (error) {
        console.error("error verifying email", error);
        throw new Error(`Error Sending Verification Email: ${error}`);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
// import { VERIFICATIONEMAILtEMPLATE } from "./emailTemplate";
// import { iUserData } from "../utils/interface";
// import { transport, sender } from "./mailtrapEmail";
// export const sendVerificationEmail = async (
//   user: iUserData,
//   verificationToken: string
// ) => {
//   const recipient = user?.email;
//   try {
//     const response = await transport.send({
//       from: sender,
//       to: recipient,
//       subject: "Verify your Email",
//       html: VERIFICATIONEMAILtEMPLATE.replace(
//         "{verifyToken}",
//         verificationToken
//       ),
//       category: "Email Verification Successful",
//     });
//     console.log("email sent successfully", response);
//   } catch (error) {
//     console.error("error verifying email", error);
//     throw new Error(`Error Sending Verification Email: ${error}`);
//   }
// };

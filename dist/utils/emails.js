"use strict";
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
exports.sendMails = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplate_1 = require("../mailtrap/emailTemplate");
const yourEmail = process.env.USER_MAIL;
const yourAppPassword = process.env.GMAIL_PASSWORD;
const sendMails = (user, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: yourEmail,
            pass: yourAppPassword,
        },
    });
    const verificationLink = process.env.NODE_ENV === "production"
        ? `https://boundarymarket.onrender.com/api/v1/verify/${verificationToken}`
        : `http://localhost:2003/api/v1/verify/${verificationToken}`;
    const mailOptions = {
        from: `Boundary-Market <${yourEmail}>`,
        to: user.email,
        subject: "Verify Your Email",
        text: `Hello, ${user.name}. Verify your email`,
        html: emailTemplate_1.VERIFICATIONEMAILtEMPLATE.replace("{verifyToken}", verificationToken)
            .replace("{name}", user === null || user === void 0 ? void 0 : user.name)
            .replace("{verificationLink}", verificationLink), // Use verificationLink here
        // };
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return verificationToken;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
});
exports.sendMails = sendMails;
const contactUsMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: yourEmail,
            pass: yourAppPassword,
        },
    });
    const mailOptions = {
        from: yourEmail, // Your authenticated email
        to: yourEmail,
        replyTo: data.email, // User's email for replies
        subject: `Message from ${data.name}`,
        text: data.message,
    };
    try {
        yield transporter.sendMail(mailOptions);
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false, error };
    }
});
exports.default = contactUsMail;

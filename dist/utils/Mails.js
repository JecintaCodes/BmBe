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
exports.sendEmailsToUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const emailTemplate_1 = require("../mailtrap/emailTemplate");
const GOOGLE_REFRESH_TOKEN = "1//04LM_VwirATu2CgYIARAAGAQSNwF-L9Ir5dkIGkH94eLQ-rvx-97jTVGCW3Tz5a3ebW9I0X6kyGCQ-KjYYYItXr-x9_UciFwb_1Y";
const GOOGLE_CLIENT = "974207110654-qa4b2dtqb7h6bdtjpdhpfnqntctf7c1t.apps.googleusercontent.com";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_SECRET_KEY = "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";
const USER_MAIL = "onyemaobijecintaugochi@gmail.com";
const LIVE_URL = "http://localhost:2003";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT, GOOGLE_SECRET_KEY, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const sendEmailsToUser = (user, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                type: "OAuth2",
                user: USER_MAIL,
                clientId: GOOGLE_CLIENT,
                clientSecret: GOOGLE_SECRET_KEY,
                refreshToken: GOOGLE_REFRESH_TOKEN,
            },
        });
        const mailOptions = {
            from: `Boundary-Market <${USER_MAIL}>`,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Verify Email",
            text: "Verify your email",
            html: emailTemplate_1.VERIFICATIONEMAILtEMPLATE.replace("{verifyToken}", verificationToken)
                .replace("{name}", user === null || user === void 0 ? void 0 : user.name)
                .replace("{verificationLink}", `${LIVE_URL}/verify/${verificationToken}`),
            category: "Email Verification Successful",
        };
        yield transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Email sending failed:", error.message);
    }
    //   }
});
exports.sendEmailsToUser = sendEmailsToUser;

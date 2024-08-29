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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const googleapis_1 = require("googleapis");
// import { iUserData } from "../model/userMode";
// import iUser
const GOOGLE_REFRESH_TOKEN = "1//04IFsTNSRYpifCgYIARAAGAQSNwF-L9IrQtk-MlkfLoRPTLeP5FSOQzJrACcEX_eb1cJvCzxgPB2RN2lDMrOit74TF1YMMp4PVjs";
const GOOGLE_CLIENT = "76597312158-nvjq3tqe0489m3upu0flchdbu9tom9nt.apps.googleusercontent.com";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_SECRET_KEY = "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";
const USER_MAIL = "ghettodeveloper@gmail.com";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT, GOOGLE_SECRET_KEY, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const sendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        // const transporter = nodemailer.createTransport({
        //   service: "gmail",
        //   auth: {
        //     type: "OAuth2",
        //     user: USER_MAIL,
        //     ClientId: GOOGLE_CLIENT,
        //     ClientSecret: GOOGLE_SECRET_KEY,
        //     ClientUrl: GOOGLE_URL,
        //   },
        // });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendEmail = sendEmail;

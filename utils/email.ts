import nodemailer from "nodemailer";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import env from "dotenv";
import fs from "fs";
import path from "path";
import { iUserData } from "../interface";

env.config();

const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_CLIENT = process.env.GOOGLE_CLIENT;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY;
const USER_MAIL = process.env.USER_MAIL;
const LIVE_URL = process.env.LIVE_URL;
const JSON_SECRET = process.env.JSON_SECRET;

const oAuth = new google.auth.OAuth2(
  GOOGLE_CLIENT,
  GOOGLE_SECRET_KEY,
  GOOGLE_URL
);

// oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
oAuth.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN,
});
const emailTemplatePath = path.join(__dirname, "../view/index.html");

export const sendEmail = async (user: iUserData) => {
  try {
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

    const accessToken: any = (await oAuth.getAccessToken()).token;

    const token = jwt.sign({ id: user?._id }, JSON_SECRET!, {
      expiresIn: "2d",
    });
    const verificationLink = `${LIVE_URL}/verify-account/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_MAIL,
        clientId: GOOGLE_CLIENT,
        clientSecret: GOOGLE_SECRET_KEY,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `onyemaobijecintaugochi <${USER_MAIL}>`,
      to: user?.email,
      subject: "Verify Your E-Mail Address",
      html: emailTemplate
        .replace("{{name}}", user?.name)
        .replace("{{verifyToken}}", user?.verifyToken)
        .replace("{{verificationLink}}", verificationLink),
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
  }
};

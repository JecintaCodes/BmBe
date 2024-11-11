import nodemailer from "nodemailer";
import { google } from "googleapis";
import { iUserData } from "./interface";
import { VERIFICATIONEMAILtEMPLATE } from "../mailtrap/emailTemplate";
const GOOGLE_REFRESH_TOKEN =
  "1//04LM_VwirATu2CgYIARAAGAQSNwF-L9Ir5dkIGkH94eLQ-rvx-97jTVGCW3Tz5a3ebW9I0X6kyGCQ-KjYYYItXr-x9_UciFwb_1Y";

const GOOGLE_CLIENT =
  "974207110654-qa4b2dtqb7h6bdtjpdhpfnqntctf7c1t.apps.googleusercontent.com";

const GOOGLE_URL = "https://developers.google.com/oauthplayground";

const GOOGLE_SECRET_KEY = "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";
const USER_MAIL = "onyemaobijecintaugochi@gmail.com";
const LIVE_URL = "http://localhost:2003";
const oAuth = new google.auth.OAuth2(
  GOOGLE_CLIENT,
  GOOGLE_SECRET_KEY,
  GOOGLE_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

export const sendEmailsToUser = async (
  user: iUserData,
  verificationToken: string
) => {
  try {
    const transporter = nodemailer.createTransport({
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
      to: user?.email,
      subject: "Verify Email",
      text: "Verify your email",
      html: VERIFICATIONEMAILtEMPLATE.replace(
        "{verifyToken}",
        verificationToken
      )
        .replace("{name}", user?.name)
        .replace(
          "{verificationLink}",
          `${LIVE_URL}/verify/${verificationToken}`
        ),
      category: "Email Verification Successful",
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error: any) {
    console.error("Email sending failed:", error.message);
  }

  //   }
};

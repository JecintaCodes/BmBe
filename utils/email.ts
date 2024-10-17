import nodemailer from "nodemailer";
import { google } from "googleapis";
import iUserData from "../model/userMode";
import jwt from "jsonwebtoken";
const GOOGLE_REFRESH_TOKEN =
  "1//04IFsTNSRYpifCgYIARAAGAQSNwF-L9IrQtk-MlkfLoRPTLeP5FSOQzJrACcEX_eb1cJvCzxgPB2RN2lDMrOit74TF1YMMp4PVjs";

const GOOGLE_CLIENT =
  "76597312158-nvjq3tqe0489m3upu0flchdbu9tom9nt.apps.googleusercontent.com";

const GOOGLE_URL = "https://developers.google.com/oauthplayground";

const GOOGLE_SECRET_KEY = "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";
const USER_MAIL = "ghettodeveloper@gmail.com";

const LIVE_URL = `https://boundary-market.web.app/`;

const oAuth = new google.auth.OAuth2(
  GOOGLE_CLIENT,
  GOOGLE_SECRET_KEY,
  GOOGLE_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

// export const sendEmail = async (user: iUserData) => {
//   try {
//     const accessToken: any = (await oAuth.getAccessToken()).token;
//     const JSON_SECRET = `lmjkiuytrfopukloiiauyietfv`;
//     const token = jwt.sign({ id: user?._id }, JSON_SECRET, { expiresIn: "2d" });

//     const url = `${LIVE_URL}/verify-account/${token}`;
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: USER_MAIL,
//         clientId: GOOGLE_CLIENT,
//         clientSecret: GOOGLE_SECRET_KEY,
//         refreshToken: GOOGLE_REFRESH_TOKEN,
//         accessToken,
//       },
//     });
//     // const token = jwt.sign({ id: user?._id }, JSON_SECRET, { expiresIn: "2d" });

//     const mailOptions = {
//       from: `onyemaobijecintaugochi <${USER_MAIL}>`,
//       to: user?.email,
//       subject: "Test Email",
//       text: "This is a test email",
//       html: `
//       <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="x-apple-disable-message-reformatting">
//     <title></title>

//     <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">

//     <style>
//         html,
//         body {
//             margin: 0 auto !important;
//             padding: 0 !important;
//             height: 100% !important;
//             width: 100% !important;
//             font-family: 'Roboto', sans-serif !important;
//             font-size: 14px;
//             margin-bottom: 10px;
//             line-height: 24px;
//             font-weight: 400;
//         }

//         * {
//             -ms-text-size-adjust: 100%;
//             -webkit-text-size-adjust: 100%;
//             margin: 0;
//             padding: 0;
//         }

//         table,
//         td {
//             mso-table-lspace: 0pt !important;
//             mso-table-rspace: 0pt !important;
//         }

//         table {
//             border-spacing: 0 !important;
//             border-collapse: collapse !important;
//             table-layout: fixed !important;
//             margin: 0 auto !important;
//         }

//         table table table {
//             table-layout: auto;
//         }

//         a {
//             text-decoration: none;
//         }

//         img {
//             -ms-interpolation-mode: bicubic;
//         }
//     </style>

// </head>

// <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
//     <main style="width: 100%; background-color: #f5f6fa;">
//         <table width="100%" border="0" cellpadding="0" cellspacing="0" bg-color="#f5f6fa">
//             <tr>
//                 <td style="padding: 40px 0;">
//                     <table style="width:100%;max-width:620px;margin:0 auto;">
//                         <tbody>
//                             <tr>
//                                 <td style="text-align: center; padding-bottom:25px">
//                                     <img style="height: 40px" src="https://res.cloudinary.com/duewdl1ua/image/upload/v1722432802/codebook_black_w1f3i7.png"
//                                             alt="logo">
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                     <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
//                         <tbody>
//                             <tr>
//                                 <td style="padding: 30px 30px 15px 30px;">
//                                     <h2 style="font-size: 18px; color: #141414; font-weight: 600; margin: 0;">Verify
//                                         Your E-Mail Address</h2>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 0 30px 20px">
//                                     <p style="margin-bottom: 10px; color:#080808 ">Hi ${user?.userName},</p>
//                                     <p style="margin-bottom: 10px; color:#080808">Welcome! <br> You are receiving this email because
//                                         you have registered on our site.</p>
//                                     <p style="margin-bottom: 10px; color:#080808">Click the button below to active your account.</p>
//                                     <p style="margin-bottom: 25px;  color:#080808">This is your verification token: ${user?.verifyToken} </p>
//                                     <a href="${LIVE_URL}/${token}/verify"
//                                         style="background-color:#141414;border-radius:4px;color:#ffffff;display:inline-block;font-size:13px;font-weight:600;line-height:44px;text-align:center;text-decoration:none;text-transform: uppercase; padding: 0 30px">Verify
//                                         Email</a>

//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 10px 30px ">
//                                     <p style="color:#080808;">If the button above does not work, paste this link
//                                         into your web browser:</p>
//                                     <a href="${LIVE_URL}/verify-account/${token}"
//                                         style="color: #6576ff; text-decoration:none;word-break: break-all;">${LIVE_URL}/verify-account/${token}</a>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 20px 30px 40px">
//                                     <p style=" color:#080808">If you did not make this request, please contact us or ignore this message.</p>
//                                     <p style="margin: 0; font-size: 13px; line-height: 22px; color:#adadaf;">This is an automatically generated
//                                         email please do not reply to this email. If you face any issues, please contact us at
//                                         <a href="#">codelab@gmail.com</a></p>
//                                 </td>
//                             </tr>

//                         </tbody>
//                     </table>

//                 </td>
//             </tr>
//         </table>
//     </main>
// </body>

//       `,
//     };

//     await transporter.sendMail(mailOptions).then(() => {
//       console.log("Email sent successfully");
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

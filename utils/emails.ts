// import nodemailer from "nodemailer";
// import { google } from "googleapis";
// import jwt from "jsonwebtoken";
// import { iUserData } from "./interface";
// import { VERIFICATIONEMAILtEMPLATE } from "../mailtrap/emailTemplate";

// const GOOGLE_CLIENT =
//   ";
// const GOOGLE_SECRET_KEY = "";
// const GOOGLE_REFRESH_TOKEN =
//   "";

// // const GOOGLE_REFRESH_TOKEN =
// //   "";
// // const GOOGLE_CLIENT =
// //   "";
// // const GOOGLE_SECRET_KEY = "";
// const GOOGLE_URL = "https://developers.google.com/oauthplayground";
// const USER_MAIL = "onyemaobijecintaugochi@gmail.com";
// const LIVE_URL = `http://localhost:5173/`;

// const oAuth = new google.auth.OAuth2(
//   GOOGLE_CLIENT,
//   GOOGLE_SECRET_KEY,
//   GOOGLE_URL
// );
// // Handle token refresh
// // Authenticate
// // auth.getAccessToken((err: any, token: string) => {
// //   if (err) {
// //     console.error(err);
// //   } else {
// //     // Use the access token
// //   }
// // });
// oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: USER_MAIL,
//     clientId: GOOGLE_CLIENT,
//     clientSecret: GOOGLE_SECRET_KEY,
//     refreshToken: GOOGLE_REFRESH_TOKEN,
//   },
// });

// export const sendMails = async (user: iUserData, verificationToken: string) => {
//   try {
//     const accessToken: any = (await oAuth.getAccessToken()).token;

//     const url = `${LIVE_URL}/verify/${verificationToken}`;

//     const mailOptions = {
//       from: `Bounary-Market <${USER_MAIL}>`,
//       to: user?.email,
//       subject: "Verify Email",
//       text: "for verification of email",
//       html: VERIFICATIONEMAILtEMPLATE,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//   } catch (error: any) {
//     console.error("Error sending email:", error.message);
//   }
// };

// //       html: `
// //       <head>
// //     <meta charset="utf-8">
// //     <meta name="viewport" content="width=device-width">
// //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
// //     <meta name="x-apple-disable-message-reformatting">
// //     <title></title>

// //     <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">

// //     <style>
// //         html,
// //         body {
// //             margin: 0 auto !important;
// //             padding: 0 !important;
// //             height: 100% !important;
// //             width: 100% !important;
// //             font-family: 'Roboto', sans-serif !important;
// //             font-size: 14px;
// //             margin-bottom: 10px;
// //             line-height: 24px;
// //             font-weight: 400;
// //         }

// //         * {
// //             -ms-text-size-adjust: 100%;
// //             -webkit-text-size-adjust: 100%;
// //             margin: 0;
// //             padding: 0;
// //         }

// //         table,
// //         td {
// //             mso-table-lspace: 0pt !important;
// //             mso-table-rspace: 0pt !important;
// //         }

// //         table {
// //             border-spacing: 0 !important;
// //             border-collapse: collapse !important;
// //             table-layout: fixed !important;
// //             margin: 0 auto !important;
// //         }

// //         table table table {
// //             table-layout: auto;
// //         }

// //         a {
// //             text-decoration: none;
// //         }

// //         img {
// //             -ms-interpolation-mode: bicubic;
// //         }
// //     </style>

// // </head>

// // <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
// //     <main style="width: 100%; background-color: #f5f6fa;">
// //         <table width="100%" border="0" cellpadding="0" cellspacing="0" bg-color="#f5f6fa">
// //             <tr>
// //                 <td style="padding: 40px 0;">
// //                     <table style="width:100%;max-width:620px;margin:0 auto;">
// //                         <tbody>
// //                             <tr>
// //                                 <td style="text-align: center; padding-bottom:25px">
// //                                     <img style="height: 40px" src="https://res.cloudinary.com/duewdl1ua/image/upload/v1722432802/codebook_black_w1f3i7.png"
// //                                             alt="logo">
// //                                 </td>
// //                             </tr>
// //                         </tbody>
// //                     </table>
// //                     <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
// //                         <tbody>
// //                             <tr>
// //                                 <td style="padding: 30px 30px 15px 30px;">
// //                                     <h2 style="font-size: 18px; color: #141414; font-weight: 600; margin: 0;">Verify
// //                                         Your E-Mail Address</h2>
// //                                 </td>
// //                             </tr>
// //                             <tr>
// //                                 <td style="padding: 0 30px 20px">
// //                                     <p style="margin-bottom: 10px; color:#080808 ">Hi ${user?.name},</p>
// //                                     <p style="margin-bottom: 10px; color:#080808">Welcome! <br> You are receiving this email because
// //                                         you have registered on our site.</p>
// //                                     <p style="margin-bottom: 10px; color:#080808">Click the button below to active your account.</p>
// //                                     <p style="margin-bottom: 25px;  color:#080808">This is your verification token: ${user?.verifyToken} </p>
// //                                     <a href="${LIVE_URL}/${token}/verify"
// //                                         style="background-color:#141414;border-radius:4px;color:#ffffff;display:inline-block;font-size:13px;font-weight:600;line-height:44px;text-align:center;text-decoration:none;text-transform: uppercase; padding: 0 30px">Verify
// //                                         Email</a>

// //                                 </td>
// //                             </tr>
// //                             <tr>
// //                                 <td style="padding: 10px 30px ">
// //                                     <p style="color:#080808;">If the button above does not work, paste this link
// //                                         into your web browser:</p>
// //                                     <a href="${LIVE_URL}/verify-account/${token}"
// //                                         style="color: #6576ff; text-decoration:none;word-break: break-all;">${LIVE_URL}/verify-account/${token}</a>
// //                                 </td>
// //                             </tr>
// //                             <tr>
// //                                 <td style="padding: 20px 30px 40px">
// //                                     <p style=" color:#080808">If you did not make this request, please contact us or ignore this message.</p>
// //                                     <p style="margin: 0; font-size: 13px; line-height: 22px; color:#adadaf;">This is an automatically generated
// //                                         email please do not reply to this email. If you face any issues, please contact us at
// //                                         <a href="#">onyemaobijecintaugochi@gmail.com</a></p>
// //                                 </td>
// //                             </tr>

// //                         </tbody>
// //                     </table>

// //                 </td>
// //             </tr>
// //         </table>
// //     </main>
// // </body>

// //       `,

// import nodemailer from "nodemailer";
// import { iUserData } from "./interface";
// import { VERIFICATIONEMAILtEMPLATE } from "../mailtrap/emailTemplate";

// interface MailOptions {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
// }

// const sendMails = async (user: iUserData, verificationToken: string) => {
//   const yourEmail = process.env.USER_MAIL;
//   const yourPassword = process.env.GMAIL_PASSWORD; // Store securely

//   // Generate verification token
//   //   const token = crypto.randomBytes(32).toString("hex");

//   // Create transporter
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: yourEmail,
//       pass: yourPassword,
//     },
//   });

//   // Email configuration
//   const mailOptions: MailOptions = {
//     from: `Boundary-Market <${yourEmail}>`,
//     to: user.email,
//     subject: "Verify Your Email",
//     text: `Hello, ${user.name}. Verify your email`,
//     html: VERIFICATIONEMAILtEMPLATE.replace("{verifyToken}", verificationToken)
//       .replace("{name}", user?.name) // Replace {username} with user's name
//       .replace(
//         "{verificationLink}",
//         `http://localhost:2003/api/v1/verify/${verificationToken}`
//       ),
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//     return verificationToken;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// export { sendMails };

import nodemailer from "nodemailer";
import { iUserData } from "./interface";
import { VERIFICATIONEMAILtEMPLATE } from "../mailtrap/emailTemplate";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
const yourEmail = process.env.USER_MAIL as string;
const yourAppPassword = process.env.GMAIL_PASSWORD as string;

const sendMails = async (user: iUserData, verificationToken: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: yourEmail,
      pass: yourAppPassword,
    },
  });

  const mailOptions: MailOptions = {
    from: `Boundary-Market <${yourEmail}>`,
    to: user.email,
    subject: "Verify Your Email",
    text: `Hello, ${user.name}. Verify your email`,
    html: VERIFICATIONEMAILtEMPLATE.replace("{verifyToken}", verificationToken)
      .replace("{name}", user?.name)
      .replace(
        "{verificationLink}",
        // `http://localhost:2003/api/v1/verify/${verificationToken}`
        `https://boundarymarket.onrender.com/api/v1/verify/${verificationToken}`
      ),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return verificationToken;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export { sendMails };

interface EmailData {
  name: string;
  email: string;
  message: string;
}

const contactUsMail = async (data: EmailData) => {
  const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export default contactUsMail;

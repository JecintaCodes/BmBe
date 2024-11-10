import * as Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { VERIFICATIONEMAILtEMPLATE } from "./emailTemplate";
import { iUserData } from "../utils/interface";
import env from "dotenv";
env.config();

if (!process.env.TOKEN || !process.env.ENDPOINT) {
  throw new Error(
    "Mailtrap token and endpoint environment variables are required"
  );
}

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.TOKEN,
    // endpoint: process.env.ENDPOINT,
  })
);

const sender = {
  address: "hello@demomailtrap.com",
  name: "Boundary-Market",
};

export const sendVerificationEmail = async (
  user: iUserData,
  verificationToken: string
) => {
  const recipient = user?.email;
  try {
    const response = await transport.sendMail({
      from: sender,
      to: recipient,
      subject: "Verify your Mail",
      html: VERIFICATIONEMAILtEMPLATE.replace(
        "{verifyToken}",
        verificationToken
      )
        .replace("{name}", user?.name) // Replace {username} with user's name
        .replace(
          "{verificationLink}",
          `http://localhost:2003/api/v1/verify/${verificationToken}`
        ), // Replace {verificationLink} with actual link
      category: "Email Verification Successful",
    });

    console.log("email sent successfully", response);
  } catch (error) {
    console.error("error verifying email", error);

    throw new Error(`Error Sending Verification Email: ${error}`);
  }
};

export { transport, sender };

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

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

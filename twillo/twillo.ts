// import twilio from "twilio";
// import env from "dotenv";
// import userMode from "../model/userMode";
// env.config();

// const accountSid = process.env.ACCOUNTSIDACCOUNTSID;
// const authToken = process.env.AUTHTOKEN;
// const twilioPhoneNumber = process.env.TWILLOPHONE;

// const twilioClient = twilio(accountSid, authToken);

// export const sendSmsVerification = async (
//   phoneNumber: string,
//   verificationCode: string
// ) => {
//   try {
//     const message = await twilioClient.messages.create({
//       from: twilioPhoneNumber,
//       to: phoneNumber,
//       body: `Your verification code is: ${verificationCode}`,
//     });
//     console.log(message.sid);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // smsVerification.ts
// export const verifySmsCode = async (user: any, verifyToken: string) => {
//   try {
//     // Retrieve saved verify Token from database
//     const query = { phoneNumber: user.phoneNumber, type: "sms" };
//     const result = await userMode.findOne(query);

//     if (!result) {
//       return false;
//     }

//     const savedVerifyToken = result.verifyToken;

//     if (verifyToken === savedVerifyToken) {
//       // Remove verification document from database
//       await userMode.deleteOne(query);
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };
// // export const verifySmsCode = async (
// //   phoneNumber: string,
// //   verificationCode: string
// // ) => {
// //   // Retrieve saved verification code from database
// //   // ...

// //   if (verificationCode === savedVerificationCode) {
// //     return true;
// //   } else {
// //     return false;
// //   }
// // };

// smsVerification.ts

import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import twilio from "twilio";
import env from "dotenv";
import { iUserData } from "../utils/interface";
import userMode from "../model/userMode";
env.config();

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioPhoneNumber = process.env.TWILLOPHONE;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Missing environment variables");
  throw new Error("Missing environment variables");
}

const twilioClient = twilio(accountSid, authToken);

const phoneUtil = PhoneNumberUtil.getInstance();

export const formatPhoneNumber = (phoneNumber: string) => {
  try {
    const parsedPhoneNumber = phoneUtil.parse(phoneNumber);
    return phoneUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164);
  } catch (error) {
    throw new Error(`Error parsing phone number: ${error}`);
  }
};

export const sendSmsVerification = async (
  phoneNumber: string,
  verificationCode: string
) => {
  if (!phoneNumber || !verificationCode) {
    throw new Error("Invalid input");
  }

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  try {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const message = await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: formattedPhoneNumber,
      body: `Your verification code is: ${verificationCode}`,
    });
    console.log(message.sid);
  } catch (error) {
    console.error(error);
    // Handle the error, e.g., return an error response
  }
};

export const verifySmsCode = async (user: iUserData, verifyToken: string) => {
  if (!user.telNumb || !verifyToken) {
    throw new Error("Invalid input");
  }

  try {
    const query = { phoneNumber: user.telNumb, type: "sms" };
    const result = await userMode.findOne(query);

    if (!result) {
      throw new Error("Verification token not found");
    }

    const savedVerifyToken = result.verifyToken;

    if (verifyToken === savedVerifyToken) {
      await userMode.deleteOne(query);
      return true;
    } else {
      throw new Error("Invalid verification token");
    }
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
};

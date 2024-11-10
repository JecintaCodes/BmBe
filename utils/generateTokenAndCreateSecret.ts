import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();
import { iUserData } from "./interface";

export const generateTokenAndSecretCode = (res: Response, userID: string) => {
  if (!userID) {
    res.status(400).send("User ID is required");
    return;
  }

  try {
    const token: string = jwt.sign({ userID }, process?.env?.JSON_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Error generating token");
  }
};

// import { Response } from "express";
// import jwt from "jsonwebtoken";
// import env from "dotenv";
// env.config();
// import { iUserData } from "./interface";
// // should be type annotated
// // const userId: string | undefined = iUserData?._id;

// export const generateTokenAndSecretCode = (res: Response, userID: string) => {
//   const token = jwt.sign({ userID }, process?.env.JSON_SECRET!, {
//     expiresIn: "7d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   return token;
// };

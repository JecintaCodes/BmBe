import { Request, Response } from "express-serve-static-core";
import userModel from "../model/userMode";
import { HTTP } from "../error/mainError";
import { genSalt, hash, compare } from "bcryptjs";
import { streamUpload } from "../utils/stream";
import { role } from "../utils/role";
import axios from "axios";
import env from "dotenv";
import { Types } from "mongoose";
import orderModel from "../model/orderModel";
import listModel from "../model/listModel";
import { generateTokenAndSecretCode } from "../utils/generateTokenAndCreateSecret";
import contactUsMail, { sendMails } from "../utils/emails";
import productModel from "../model/productModel";
env.config();

// ...

// import { createClient } from "redis";

// const client = createClient()
//   .on("error", (err) => console.error(err))
//   .connect();
export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user?.verify) {
      const comp = await compare(password, user?.password);

      if (comp) {
        // Redirect to respective screens
        switch (user?.role) {
          case "ADMIN":
            return res.status(HTTP.CREATED).json({
              message: `Welcome Admin ${user.name}`,
              data: user,
            });
          case "BUYER":
            return res.status(HTTP.CREATED).json({
              message: `Welcome Buyer ${user.name}`,
              data: user,
            });
          case "USER":
            return res.status(HTTP.CREATED).json({
              message: `Welcome User ${user.name}`,
              data: user,
            });
          default:
            return res.status(HTTP.BAD_REQUEST).json({
              message: "Invalid role",
            });
        }
      } else {
        return res.status(HTTP.BAD_REQUEST).json({
          message: `Incorrect Password`,
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `please register as a user`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error signing in :${error}`,
    });
  }
};
// export const signInUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });

//     if (user?.verify) {
//       const comp = await compare(password, user?.password);

//       console.log(user);
//       if (comp) {
//         return res.status(HTTP.CREATED).json({
//           message: `welcome ${user.name}`,
//           data: user,
//         });
//       } else {
//         return res.status(HTTP.BAD_REQUEST).json({
//           message: `Incorrect Password`,
//         });
//       }
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `please register as a user`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error signing in :${error}`,
//     });
//   }
// // };

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find({}, null, {
      sort: { createdAt: "descending" },
    });

    return res.status(HTTP.OK).json({
      message: "all user gotten",
      data: user,
      totalUse: user.length,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error signing in :${error}`,
    });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await userModel.findById(userID);

    return res.status(HTTP.OK).json({
      message: "one user gotten",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting one in :${error}`,
    });
  }
};

export const updateUserImage = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { secure_url, public_id }: any = streamUpload(req);

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        image: secure_url,
        imageID: public_id,
      },
      { new: true }
    );
    console.log(secure_url, public_id);
    return res.status(HTTP.CREATED).json({
      message: `user avatar updated`,
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error updating admin image ${error} `,
    });
  }
};

export const updateUserName = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const { name } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        name,
      },
      { new: true }
    );

    return res.status(HTTP.CREATED).json({
      message: " name updated ",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `user name not updated ${error}`,
    });
  }
};

export const updateUserdescription = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { description } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        description,
      },
      { new: true }
    );
    return res.status(HTTP.CREATED).json({
      message: "user description updated ",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error updating details: ${error}`,
    });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { name, description } = req.body;
    const { secure_url, public_id }: any = streamUpload(req);

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        name,
        description,
        image: secure_url,
        imageID: public_id,
      },
      { new: true }
    );

    return res.status(HTTP.CREATED).json({
      message: `user information updated`,
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error updating user info ${error} `,
    });
  }
};
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      telNumb,
      password,
      secretCode,
      status,
      address,
      verifyToken,
      verifyTokenExp,
    } = req.body;
    if (!name || !email || !telNumb || !password || !secretCode || !address) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Missing required fields",
        error: "Validation error",
      });
    }

    const secret = process.env.SECRETCODE;
    if (!secret) {
      throw new Error("SECRETCODE environment variable is not set");
    }
    if (secret === secretCode) {
      const salt = await genSalt(10);
      const harsh = await hash(password, salt);
      // const verificationCode = generateVerificationCode();
      const verifyToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const user = await userModel.create({
        name,
        email,
        address,
        telNumb,
        password: harsh,
        secretCode: secret,
        role: "ADMIN",
        verifyToken,
        verifyTokenExp: Date.now() + 24 * 60 * 60 * 1000,
      });
      // await sendSmsVerification(telNumb, verifyToken);
      //  jwt;

      try {
        generateTokenAndSecretCode(res, user?._id as string);
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Error generating token");
      }
      await sendMails(user, verifyToken);
      console.log("mail sent");

      return res.status(HTTP.CREATED).json({
        message: "user created",
        data: user,
      });
    } else {
      return res.status(HTTP.OK).json({
        message: `your secretcode is wronge`,
      });
    }
    // }
  } catch (error) {
    return res.status(HTTP.OK).json({
      message: `error creating user ${error}`,
    });
  }
};

//   try {
//     const { name, email, telNumb, password, secretCode, status, address } =
//       req.body;

//     // Input validation
//     if (!name || !email || !telNumb || !password || !secretCode || !address) {
//       return res
//         .status(HTTP.BAD_REQUEST)
//         .json({ message: "Missing required fields" });
//     }

//     // Environment variable for secret code
//     const SECRET_CODE = process.env.SECRET_CODE;

//     // Compare secret code securely
//     const isSecretCodeValid = crypto.timingSafeEqual(
//       Buffer.from(SECRET_CODE),
//       Buffer.from(secretCode)
//     );
//     if (!isSecretCodeValid) {
//       return res
//         .status(HTTP.BAD_REQUEST)
//         .json({ message: "Invalid secret code" });
//     }

//     // Increased salt rounds for better security
//     const salt = await genSalt(12);
//     const hasrh = await hash(password, salt);

//     // Create user
//     const user = await userModel.create({
//       name,
//       email,
//       address,
//       telNumb,
//       password: hasrh,
//       role: "ADMIN",
//       verify: true,
//     });

//     return res
//       .status(HTTP.CREATED)
//       .json({ message: "Admin created successfully", data: user });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(HTTP.INTERNAL_SERVER_ERROR)
//       .json({ message: "Error creating admin" });
//   }
// };

// export const verify = async (req: Request, res: Response) => {
//   try {
//     const { verifyToken, email } = req.body;

//     if (!verifyToken || !email) {
//       return res.status(HTTP.BAD_REQUEST).json("invalid input");
//     }
//     const user = userModel.findOne({ email, verifyToken });

//      if (!user) {
//        return res.status(404).send({ message: "User not found" });
//      }

//      // Verify user's email
//     user!.verify = true;
//     user!.verifyToken = null;
//     await user.save();

//     return res.send({ message: 'Email verified successfully' });

//   } catch (error: any) {
//     return res.status(404).json({
//       message: `error verifing user:${error}`,
//     });
//   }
// };
export const verifyUserAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { verifyToken } = req.body;

    if (!userID || !verifyToken) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const accountUser = await userModel.findById(userID);

    if (accountUser?.verifyToken === verifyToken) {
      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          verifyToken: "",
          verify: true,
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "user account verified successfully", data: user });
    } else {
      return res.status(404).json({ message: "Invalid token" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

// export const verifyEmail = async (req: Request, res: Response) => {
//   const { verificationToken } = req.params;
//   console.log("Received verification token:", verificationToken);

//   // Find the user based on the token
//   const user = await userModel.findOne({ verifyToken: verificationToken });
//   console.log("User found:", user);

//   if (!user) {
//     return res.status(404).json({ message: "Invalid verification token" });
//   }

//   // Continue with your verification logic...
// };

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.params;
    console.log("Received verification token:", verificationToken);

    // Find the user based on the token
    const user = await userModel.findOne({ verifyToken: verificationToken });

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // If user found, mark as verified (you can customize this part based on your needs)
    user.verify = true;
    user.verifyToken = "";
    await user.save();

    // Optionally, send a success message or redirect
    return res.redirect("https://boundary-market1.web.app/sign-in"); // or a success page
    // return res.redirect("http://localhost:5173/sign-in"); // or a success page
  } catch (err) {
    console.error("Error during email verification:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Generate and send verification code

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { verifyToken },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    await sendMails(updatedUser, verifyToken);

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending verification email" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { adminID } = req.params;

    const {
      name,
      email,
      password,
      status,
      address,
      telNumb,
      accountNumb,
      bankName,
      bankCode,
    } = req.body;

    const admin = await userModel.findById(adminID);

    if (admin?.role === role.admin) {
      const salt = await genSalt(12);
      const hashedPassword = await hash(password, salt);
      const verifyToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Create user
      const user = await userModel.create({
        name,
        email,
        telNumb,
        address,
        accountNumb,
        bankName,
        bankCode,
        password: hashedPassword,
        status,
        role: "USER",
        verifyToken,
        verifyTokenExp: Date.now() + 24 * 60 * 60 * 1000,
      });

      try {
        generateTokenAndSecretCode(res, user?._id as string);
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Error generating token");
      }
      await sendMails(user, verifyToken);
      console.log("mail sent");

      // Create Paystack subaccount
      const paystackKey = process.env.PAYSTACKKEY;
      const paystackConfig = {
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          "Content-Type": "application/json",
        },
      };
      const subaccountData = {
        business_name: user.name,
        bank_code: user.bankCode,
        account_number: user.accountNumb,
        percentage_charge: 10,
      };

      try {
        const subaccountResponse = await axios.post(
          "https://api.paystack.co/subaccount",
          subaccountData,
          paystackConfig
        );
        const subaccountCode = subaccountResponse.data.data.id;

        // Update user with subaccount code
        await userModel.findByIdAndUpdate(user._id, {
          subAccountCode: subaccountCode,
        });

        // Retrieve updated user data
        const updatedUser = await userModel.findById(user._id);

        return res.status(HTTP.CREATED).json({
          message: "User created",
          data: updatedUser,
        });
      } catch (paystackError) {
        console.error("Paystack API Error:", paystackError);
        return res.status(HTTP.BAD_REQUEST).json({
          message: "Error creating Paystack subaccount",
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `You are not an admin`,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error creating user ${error}`,
    });
  }
};

export const registerUsers = async (req: Request, res: Response) => {
  try {
    const { adminID } = req.params;

    const {
      name,
      email,
      password,
      status,
      address,
      telNumb,
      accountNumb,
      bankName,
      bankCode,
    } = req.body;

    const admin = await userModel.findById(adminID);

    if (admin?.role === role.admin) {
      const salt = await genSalt(2);
      const hashedPassword = await hash(password, salt);

      // Create user
      const user = await userModel.create({
        name,
        email,
        telNumb,
        address,
        accountNumb,
        bankName,
        bankCode,
        password: hashedPassword,
        status,
        role: "USER",
        verify: true,
      });

      // Create Paystack subaccount
      const paystackKey = process.env.PAYSTACKKEY;
      const paystackConfig = {
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          "Content-Type": "application/json",
        },
      };
      const subaccountData = {
        business_name: user.name,
        bank_code: user.bankCode,
        account_number: user.accountNumb,
        percentage_charge: 11,
      };

      try {
        const subaccountResponse = await axios.post(
          `https://api.paystack.co/subaccount`,
          subaccountData,
          paystackConfig
        );
        const subaccountCode = subaccountResponse.data.data.id;
        console.log(subaccountCode);
        // Update user with subaccount code
        await userModel.findByIdAndUpdate(user._id, {
          subAccountCode: subaccountCode,
        });
      } catch (paystackError) {
        console.error("Paystack API Error:", paystackError);
        return res.status(HTTP.BAD_REQUEST).json({
          message: "Error creating Paystack subaccount",
        });
      }

      return res.status(HTTP.CREATED).json({
        message: "User created",
        data: user,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `You are not an admin`,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error creating user ${error}`,
    });
  }
};

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { adminID } = req.params;

//     const {
//       name,
//       email,
//       password,
//       status,
//       address,
//       telNumb,
//       accountNumb,
//       subAccountCode,
//       bankName,
//       bankCode,
//     } = req.body;

//     const admin = await userModel.findById(adminID);

//     if (admin?.role === role?.admin) {
//       const salt = await genSalt(2);
//       const harsh = await hash(password, salt);

//       const user = await userModel.create({
//         name,
//         email,
//         telNumb,
//         address,
//         accountNumb,
//         bankName,
//         bankCode,
//         subAccountCode,
//         password: harsh,
//         status,
//         role: "USER",
//         verify: true,
//       });
//       return res.status(HTTP.CREATED).json({
//         message: "user created",
//         data: user,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not an admin`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error creating user ${error}`,
//     });
//   }
// };

export const registerBuyer = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, telNumb } = req.body;

    const salt = await genSalt(2);
    const harsh = await hash(password, salt);
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const buyer = await userModel.create({
      name,
      email,
      address,
      telNumb,
      password: harsh,
      role: "BUYER",
      verifyToken,
      verifyTokenExp: Date.now() + 24 * 60 * 60 * 1000,
    });
    try {
      generateTokenAndSecretCode(res, buyer?._id as string);
    } catch (error) {
      console.error("Error generating token:", error);
      res.status(500).send("Error generating token");
    }
    await sendMails(buyer, verifyToken);
    // await sendEmailsToUser(buyer, verifyToken);
    console.log("mail sent");
    return res.status(HTTP.CREATED).json({
      message: "user created",
      data: buyer,
    });
  } catch (error) {
    return res.status(HTTP.OK).json({
      message: `error creating user ${error}`,
    });
  }
};

// export const searchDataBase = async (req: Request, res: Response) => {
//   try {
//     const { name, email, role } = req.query;

//     const filter: any = {};

//     if (name) {
//       filter.name = new RegExp(name, "i");
//     }

//     if (email) {
//       filter.email = new RegExp(email, "i");
//     }

//     if (role) {
//       filter.role = role;
//     }

//     const users = await userModel.find(filter);

//     return res.status(200).json({
//       message: "Search results",
//       data: users,
//     });
//   } catch (error: any) {
//     // Handle error
//   }
// };

export const searchDataBase = async (req: Request, res: Response) => {
  try {
    const { email, userID, name, role } = req.query;

    // Input validation and sanitization
    const filteredEmail = typeof email === "string" ? email.trim() : null;
    const filteredUserID = typeof userID === "string" ? userID.trim() : null;
    const filteredName = typeof name === "string" ? name.trim() : null;
    const filteredRole = typeof role === "string" ? role.trim() : null;

    const filter: any = {};

    if (filteredEmail) {
      filter.email = new RegExp(filteredEmail, "i");
    }

    if (filteredUserID) {
      filter._id = new Types.ObjectId(filteredUserID);
    }

    if (filteredName) {
      filter.name = new RegExp(filteredName, "i");
    }

    if (filteredRole) {
      filter.role = new RegExp(filteredRole, "i");
    }

    // MongoDB query
    const users = await userModel.find(filter);

    return res.status(200).json({
      message: "Search results",
      data: users,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching database",
      error: error.message,
    });
  }
};
export const searchOrder = async (req: Request, res: Response) => {
  try {
    const { date, orderID, title, productOwner } = req.query;

    // Input validation and sanitization
    const filteredDate = typeof date === "string" ? date.trim() : null;
    const filteredOrderID = typeof orderID === "string" ? orderID.trim() : null;
    const filteredTitle = typeof title === "string" ? title.trim() : null;
    const filteredProductOwner =
      typeof productOwner === "string" ? productOwner.trim() : null;

    const filter: any = {};

    if (filteredDate) {
      filter.date = new RegExp(filteredDate, "i");
    }

    if (filteredOrderID) {
      filter._id = new Types.ObjectId(filteredOrderID);
    }

    if (filteredTitle) {
      filter.title = new RegExp(filteredTitle, "i");
    }

    if (filteredProductOwner) {
      filter.productOwner = new RegExp(filteredProductOwner, "i");
    }

    // MongoDB query
    const orders = await orderModel.find(filter);

    return res.status(200).json({
      message: "Search results",
      data: orders,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching database",
      error: error.message,
    });
  }
};

export const searchListOrder = async (req: Request, res: Response) => {
  try {
    const { date, listID, userID, email } = req.query;

    // Input validation and sanitization
    const filteredDate = typeof date === "string" ? date.trim() : null;
    const filteredListID = typeof listID === "string" ? listID.trim() : null;
    const filteredUserID = typeof userID === "string" ? userID.trim() : null;
    const filteredEmail = typeof email === "string" ? email.trim() : null;

    const filter: any = {};

    if (filteredDate) {
      filter.createdAt = new RegExp(filteredDate, "i");
    }

    if (filteredListID) {
      filter._id = new Types.ObjectId(filteredListID);
    }

    if (filteredUserID) {
      filter.userID = new Types.ObjectId(filteredUserID);
    }

    if (filteredEmail) {
      filter.email = new RegExp(filteredEmail, "i");
    }

    // MongoDB query
    const orders = await listModel.find(filter);

    return res.status(200).json({
      message: "Search results",
      data: orders,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching database",
      error: error.message,
    });
  }
};

// export const forgetUserPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

//     const getUser = await userMode.findOne({ email });

//     if (getUser && getUser?.verify) {
//       const user = await userMode.findByIdAndUpdate(
//         getUser?._id,
//         {
//           verifyToken,
//         },
//         { new: true }
//       );

//       try {
//         generateTokenAndSecretCode(res, getUser?._id as string);
//       } catch (error) {
//         console.error("Error generating token:", error);
//         res.status(500).send("Error generating token");
//       }
//       await sendMails(getUser, verifyToken);
//       console.log("mail sent");

//       return res
//         .status(201)
//         .json({ message: "created successfully", data: user });
//     } else {
//       return res.status(404).json({ message: "user can't be found" });
//     }
//   } catch (error: any) {
//     return res.status(404).json({ message: error.message });
//   }
// };
// export const forgetUserPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     // Input validation
//     if (!email || !email.trim()) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

//     const getUser = await userMode.findOne({ email });

//     if (!getUser || !getUser.verify) {
//       return res
//         .status(404)
//         .json({ message: "User not found or not verified" });
//     }

//     const user = await userMode.findByIdAndUpdate(
//       getUser._id,
//       { verifyToken },
//       { new: true }
//     );

//     if (!user) {
//       throw new Error("Failed to update user");
//     }

//     try {
//       await generateTokenAndSecretCode(res, user._id as string);
//       await sendMails(user, verifyToken);
//     } catch (error) {
//       console.error("Error generating token or sending email:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }

//     return res
//       .status(201)
//       .json({ message: "Token sent successfully", data: user });
//   } catch (error: any) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const salt = await genSalt(10);
    const hashed = await hash(password, salt);

    const getUser = await userModel.findById(userID);

    if (getUser && getUser?.verify && getUser?.verifyToken !== "") {
      const user = await userModel.findByIdAndUpdate(
        getUser?._id,
        {
          verifyToken: "",
          password: hashed,
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "created successfully", data: user });
    } else {
      return res.status(404).json({ message: "user can't be found" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
export const contactMail = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const emailData = { name, email, message };
    const response = await contactUsMail(emailData);
    res.status(HTTP.CREATED).json({
      message: "mail sent successfully",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
export const deleteBuyerAndAdmin = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndDelete(userID);
    return res.status(HTTP.OK).json({
      message: "buyer deleted",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error deleting user ${error}`,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID, productID, serviceID } = req.params;

    const user = await userModel.findByIdAndDelete(userID);

    // await productModel.

    return res.status(HTTP.OK).json({
      message: "user deleted",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error deleting user ${error}`,
    });
  }
};

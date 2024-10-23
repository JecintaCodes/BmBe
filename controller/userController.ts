import { Request, Response } from "express-serve-static-core";
import userModel from "../model/userMode";
import { HTTP } from "../error/mainError";
import { genSalt, hash, compare } from "bcryptjs";
import { streamUpload } from "../utils/stream";
import { role } from "../utils/role";
import axios from "axios";
import env from "dotenv";
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
    const user = await userModel.find();

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
    const { name, email, telNumb, password, secretCode, status, address } =
      req.body;
    // const catchData = await (await client)
    //   .get(`${name}`)
    //   .then(async (res: any) => {
    //     return JSON.parse(res);
    //   });
    // const catchResult = await catchData;
    // if (catchResult) {
    //   user = catchResult;
    // } else {

    // Input validation
    // Input validation
    if (!name || !email || !telNumb || !password || !secretCode || !address) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Missing required fields",
        error: "Validation error",
      });
    }

    const secret = "AjegunleCore";
    if (!secret) {
      throw new Error("SECRETCODE environment variable is not set");
    }
    if (secret === secretCode) {
      const salt = await genSalt(10);
      const harsh = await hash(password, salt);
      const user = await userModel.create({
        name,
        email,
        address,
        telNumb,
        password: harsh,
        secretCode: secret,
        role: "ADMIN",
        verify: true,
      });
      // (await client).set(`${name}`, JSON.stringify(user), {
      //   EX: 3600,
      //   NX: true,
      // });
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
// export const registerAdmin = async (req: Request, res: Response) => {
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
    const buyer = await userModel.create({
      name,
      email,
      address,
      telNumb,
      password: harsh,
      role: "BUYER",
      verify: true,
    });
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

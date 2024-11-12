"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMail = exports.resetUserPassword = exports.searchListOrder = exports.searchOrder = exports.searchDataBase = exports.registerBuyer = exports.registerUsers = exports.registerUser = exports.sendVerificationCode = exports.verifyEmail = exports.verifyUserAccount = exports.registerAdmin = exports.updateUserInfo = exports.updateUserdescription = exports.updateUserName = exports.updateUserImage = exports.getOneUser = exports.getAllUser = exports.signInUser = void 0;
const userMode_1 = __importDefault(require("../model/userMode"));
const mainError_1 = require("../error/mainError");
const bcryptjs_1 = require("bcryptjs");
const stream_1 = require("../utils/stream");
const role_1 = require("../utils/role");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
const orderModel_1 = __importDefault(require("../model/orderModel"));
const listModel_1 = __importDefault(require("../model/listModel"));
const generateTokenAndCreateSecret_1 = require("../utils/generateTokenAndCreateSecret");
const emails_1 = __importStar(require("../utils/emails"));
dotenv_1.default.config();
// ...
// import { createClient } from "redis";
// const client = createClient()
//   .on("error", (err) => console.error(err))
//   .connect();
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userMode_1.default.findOne({ email });
        if (user === null || user === void 0 ? void 0 : user.verify) {
            const comp = yield (0, bcryptjs_1.compare)(password, user === null || user === void 0 ? void 0 : user.password);
            if (comp) {
                // Redirect to respective screens
                switch (user === null || user === void 0 ? void 0 : user.role) {
                    case "ADMIN":
                        return res.status(mainError_1.HTTP.CREATED).json({
                            message: `Welcome Admin ${user.name}`,
                            data: user,
                        });
                    case "BUYER":
                        return res.status(mainError_1.HTTP.CREATED).json({
                            message: `Welcome Buyer ${user.name}`,
                            data: user,
                        });
                    case "USER":
                        return res.status(mainError_1.HTTP.CREATED).json({
                            message: `Welcome User ${user.name}`,
                            data: user,
                        });
                    default:
                        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                            message: "Invalid role",
                        });
                }
            }
            else {
                return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                    message: `Incorrect Password`,
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `please register as a user`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error signing in :${error}`,
        });
    }
});
exports.signInUser = signInUser;
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
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userMode_1.default.find({}, null, {
            sort: { createdAt: "descending" },
        });
        return res.status(mainError_1.HTTP.OK).json({
            message: "all user gotten",
            data: user,
            totalUse: user.length,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error signing in :${error}`,
        });
    }
});
exports.getAllUser = getAllUser;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userMode_1.default.findById(userID);
        return res.status(mainError_1.HTTP.OK).json({
            message: "one user gotten",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error getting one in :${error}`,
        });
    }
});
exports.getOneUser = getOneUser;
const updateUserImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { secure_url, public_id } = (0, stream_1.streamUpload)(req);
        const user = yield userMode_1.default.findByIdAndUpdate(userID, {
            image: secure_url,
            imageID: public_id,
        }, { new: true });
        console.log(secure_url, public_id);
        return res.status(mainError_1.HTTP.CREATED).json({
            message: `user avatar updated`,
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error updating admin image ${error} `,
        });
    }
});
exports.updateUserImage = updateUserImage;
const updateUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { name } = req.body;
        const user = yield userMode_1.default.findByIdAndUpdate(userID, {
            name,
        }, { new: true });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: " name updated ",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `user name not updated ${error}`,
        });
    }
});
exports.updateUserName = updateUserName;
const updateUserdescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { description } = req.body;
        const user = yield userMode_1.default.findByIdAndUpdate(userID, {
            description,
        }, { new: true });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "user description updated ",
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error updating details: ${error}`,
        });
    }
});
exports.updateUserdescription = updateUserdescription;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { name, description } = req.body;
        const { secure_url, public_id } = (0, stream_1.streamUpload)(req);
        const user = yield userMode_1.default.findByIdAndUpdate(userID, {
            name,
            description,
            image: secure_url,
            imageID: public_id,
        }, { new: true });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: `user information updated`,
            data: user,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error updating user info ${error} `,
        });
    }
});
exports.updateUserInfo = updateUserInfo;
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, telNumb, password, secretCode, status, address, verifyToken, verifyTokenExp, } = req.body;
        if (!name || !email || !telNumb || !password || !secretCode || !address) {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: "Missing required fields",
                error: "Validation error",
            });
        }
        const secret = process.env.SECRETCODE;
        if (!secret) {
            throw new Error("SECRETCODE environment variable is not set");
        }
        if (secret === secretCode) {
            const salt = yield (0, bcryptjs_1.genSalt)(10);
            const harsh = yield (0, bcryptjs_1.hash)(password, salt);
            // const verificationCode = generateVerificationCode();
            const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
            const user = yield userMode_1.default.create({
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
                (0, generateTokenAndCreateSecret_1.generateTokenAndSecretCode)(res, user === null || user === void 0 ? void 0 : user._id);
            }
            catch (error) {
                console.error("Error generating token:", error);
                res.status(500).send("Error generating token");
            }
            yield (0, emails_1.sendMails)(user, verifyToken);
            console.log("mail sent");
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "user created",
                data: user,
            });
        }
        else {
            return res.status(mainError_1.HTTP.OK).json({
                message: `your secretcode is wronge`,
            });
        }
        // }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.OK).json({
            message: `error creating user ${error}`,
        });
    }
});
exports.registerAdmin = registerAdmin;
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
const verifyUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { verifyToken } = req.body;
        if (!userID || !verifyToken) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const accountUser = yield userMode_1.default.findById(userID);
        if ((accountUser === null || accountUser === void 0 ? void 0 : accountUser.verifyToken) === verifyToken) {
            const user = yield userMode_1.default.findByIdAndUpdate(userID, {
                verifyToken: "",
                verify: true,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "user account verified successfully", data: user });
        }
        else {
            return res.status(404).json({ message: "Invalid token" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.verifyUserAccount = verifyUserAccount;
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
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationToken } = req.params;
        console.log("Received verification token:", verificationToken);
        // Find the user based on the token
        const user = yield userMode_1.default.findOne({ verifyToken: verificationToken });
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ message: "Invalid verification token" });
        }
        // If user found, mark as verified (you can customize this part based on your needs)
        user.verify = true;
        user.verifyToken = "";
        yield user.save();
        // Optionally, send a success message or redirect
        return res.redirect("https://boundary-market1.web.app/sign-in"); // or a success page
        // return res.redirect("http://localhost:5173/sign-in"); // or a success page
    }
    catch (err) {
        console.error("Error during email verification:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmail = verifyEmail;
// Generate and send verification code
const sendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
        const updatedUser = yield userMode_1.default.findOneAndUpdate({ email }, { verifyToken }, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        yield (0, emails_1.sendMails)(updatedUser, verifyToken);
        res.json({ message: "Verification code sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending verification email" });
    }
});
exports.sendVerificationCode = sendVerificationCode;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const { name, email, password, status, address, telNumb, accountNumb, bankName, bankCode, } = req.body;
        const admin = yield userMode_1.default.findById(adminID);
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === role_1.role.admin) {
            const salt = yield (0, bcryptjs_1.genSalt)(12);
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, salt);
            // Create user
            const user = yield userMode_1.default.create({
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
                const subaccountResponse = yield axios_1.default.post("https://api.paystack.co/subaccount", subaccountData, paystackConfig);
                const subaccountCode = subaccountResponse.data.data.id;
                // Update user with subaccount code
                yield userMode_1.default.findByIdAndUpdate(user._id, {
                    subAccountCode: subaccountCode,
                });
                // Retrieve updated user data
                const updatedUser = yield userMode_1.default.findById(user._id);
                return res.status(mainError_1.HTTP.CREATED).json({
                    message: "User created",
                    data: updatedUser,
                });
            }
            catch (paystackError) {
                console.error("Paystack API Error:", paystackError);
                return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                    message: "Error creating Paystack subaccount",
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `You are not an admin`,
            });
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error creating user ${error}`,
        });
    }
});
exports.registerUser = registerUser;
const registerUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const { name, email, password, status, address, telNumb, accountNumb, bankName, bankCode, } = req.body;
        const admin = yield userMode_1.default.findById(adminID);
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === role_1.role.admin) {
            const salt = yield (0, bcryptjs_1.genSalt)(2);
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, salt);
            // Create user
            const user = yield userMode_1.default.create({
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
                const subaccountResponse = yield axios_1.default.post(`https://api.paystack.co/subaccount`, subaccountData, paystackConfig);
                const subaccountCode = subaccountResponse.data.data.id;
                console.log(subaccountCode);
                // Update user with subaccount code
                yield userMode_1.default.findByIdAndUpdate(user._id, {
                    subAccountCode: subaccountCode,
                });
            }
            catch (paystackError) {
                console.error("Paystack API Error:", paystackError);
                return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                    message: "Error creating Paystack subaccount",
                });
            }
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "User created",
                data: user,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `You are not an admin`,
            });
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error creating user ${error}`,
        });
    }
});
exports.registerUsers = registerUsers;
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
const registerBuyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, address, telNumb } = req.body;
        const salt = yield (0, bcryptjs_1.genSalt)(2);
        const harsh = yield (0, bcryptjs_1.hash)(password, salt);
        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
        const buyer = yield userMode_1.default.create({
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
            (0, generateTokenAndCreateSecret_1.generateTokenAndSecretCode)(res, buyer === null || buyer === void 0 ? void 0 : buyer._id);
        }
        catch (error) {
            console.error("Error generating token:", error);
            res.status(500).send("Error generating token");
        }
        yield (0, emails_1.sendMails)(buyer, verifyToken);
        // await sendEmailsToUser(buyer, verifyToken);
        console.log("mail sent");
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "user created",
            data: buyer,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.OK).json({
            message: `error creating user ${error}`,
        });
    }
});
exports.registerBuyer = registerBuyer;
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
const searchDataBase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userID, name, role } = req.query;
        // Input validation and sanitization
        const filteredEmail = typeof email === "string" ? email.trim() : null;
        const filteredUserID = typeof userID === "string" ? userID.trim() : null;
        const filteredName = typeof name === "string" ? name.trim() : null;
        const filteredRole = typeof role === "string" ? role.trim() : null;
        const filter = {};
        if (filteredEmail) {
            filter.email = new RegExp(filteredEmail, "i");
        }
        if (filteredUserID) {
            filter._id = new mongoose_1.Types.ObjectId(filteredUserID);
        }
        if (filteredName) {
            filter.name = new RegExp(filteredName, "i");
        }
        if (filteredRole) {
            filter.role = new RegExp(filteredRole, "i");
        }
        // MongoDB query
        const users = yield userMode_1.default.find(filter);
        return res.status(200).json({
            message: "Search results",
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error searching database",
            error: error.message,
        });
    }
});
exports.searchDataBase = searchDataBase;
const searchOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, orderID, title, productOwner } = req.query;
        // Input validation and sanitization
        const filteredDate = typeof date === "string" ? date.trim() : null;
        const filteredOrderID = typeof orderID === "string" ? orderID.trim() : null;
        const filteredTitle = typeof title === "string" ? title.trim() : null;
        const filteredProductOwner = typeof productOwner === "string" ? productOwner.trim() : null;
        const filter = {};
        if (filteredDate) {
            filter.date = new RegExp(filteredDate, "i");
        }
        if (filteredOrderID) {
            filter._id = new mongoose_1.Types.ObjectId(filteredOrderID);
        }
        if (filteredTitle) {
            filter.title = new RegExp(filteredTitle, "i");
        }
        if (filteredProductOwner) {
            filter.productOwner = new RegExp(filteredProductOwner, "i");
        }
        // MongoDB query
        const orders = yield orderModel_1.default.find(filter);
        return res.status(200).json({
            message: "Search results",
            data: orders,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error searching database",
            error: error.message,
        });
    }
});
exports.searchOrder = searchOrder;
const searchListOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, listID, userID, email } = req.query;
        // Input validation and sanitization
        const filteredDate = typeof date === "string" ? date.trim() : null;
        const filteredListID = typeof listID === "string" ? listID.trim() : null;
        const filteredUserID = typeof userID === "string" ? userID.trim() : null;
        const filteredEmail = typeof email === "string" ? email.trim() : null;
        const filter = {};
        if (filteredDate) {
            filter.createdAt = new RegExp(filteredDate, "i");
        }
        if (filteredListID) {
            filter._id = new mongoose_1.Types.ObjectId(filteredListID);
        }
        if (filteredUserID) {
            filter.userID = new mongoose_1.Types.ObjectId(filteredUserID);
        }
        if (filteredEmail) {
            filter.email = new RegExp(filteredEmail, "i");
        }
        // MongoDB query
        const orders = yield listModel_1.default.find(filter);
        return res.status(200).json({
            message: "Search results",
            data: orders,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error searching database",
            error: error.message,
        });
    }
});
exports.searchListOrder = searchListOrder;
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
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { userID } = req.params;
        const salt = yield (0, bcryptjs_1.genSalt)(10);
        const hashed = yield (0, bcryptjs_1.hash)(password, salt);
        const getUser = yield userMode_1.default.findById(userID);
        if (getUser && (getUser === null || getUser === void 0 ? void 0 : getUser.verify) && (getUser === null || getUser === void 0 ? void 0 : getUser.verifyToken) !== "") {
            const user = yield userMode_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
                verifyToken: "",
                password: hashed,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "created successfully", data: user });
        }
        else {
            return res.status(404).json({ message: "user can't be found" });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.resetUserPassword = resetUserPassword;
const contactMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        const emailData = { name, email, message };
        const response = yield (0, emails_1.default)(emailData);
        res.status(mainError_1.HTTP.CREATED).json({
            message: "mail sent successfully",
            data: response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error });
    }
});
exports.contactMail = contactMail;

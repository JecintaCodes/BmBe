"use strict";
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
exports.registerBuyer = exports.registerUser = exports.registerAdmin = exports.updateUserInfo = exports.updateUserdescription = exports.updateUserName = exports.updateUserImage = exports.getOneUser = exports.getAllUser = exports.signInUser = void 0;
const userMode_1 = __importDefault(require("../model/userMode"));
const mainError_1 = require("../error/mainError");
const bcryptjs_1 = require("bcryptjs");
const stream_1 = require("../utils/stream");
const role_1 = require("../utils/role");
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
            console.log(user);
            if (comp) {
                return res.status(mainError_1.HTTP.CREATED).json({
                    message: `welcome ${user.name}`,
                    data: user,
                });
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
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userMode_1.default.find();
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
        const { name, email, telNumb, password, secretCode, status, address } = req.body;
        // const catchData = await (await client)
        //   .get(`${name}`)
        //   .then(async (res: any) => {
        //     return JSON.parse(res);
        //   });
        // const catchResult = await catchData;
        // if (catchResult) {
        //   user = catchResult;
        // } else {
        const secret = "AjegunleCore";
        if (secret === secretCode) {
            const salt = yield (0, bcryptjs_1.genSalt)(2);
            const harsh = yield (0, bcryptjs_1.hash)(password, salt);
            const user = yield userMode_1.default.create({
                name,
                email,
                address,
                telNumb,
                password: harsh,
                status,
                secretCode,
                role: "ADMIN",
                verify: true,
            });
            // (await client).set(`${name}`, JSON.stringify(user), {
            //   EX: 3600,
            //   NX: true,
            // });
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
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const { name, email, password, status, address, telNumb, accountNumb } = req.body;
        const admin = yield userMode_1.default.findById(adminID);
        if ((admin === null || admin === void 0 ? void 0 : admin.role) === (role_1.role === null || role_1.role === void 0 ? void 0 : role_1.role.admin)) {
            const salt = yield (0, bcryptjs_1.genSalt)(2);
            const harsh = yield (0, bcryptjs_1.hash)(password, salt);
            const user = yield userMode_1.default.create({
                name,
                email,
                telNumb,
                address,
                accountNumb,
                password: harsh,
                status,
                role: "USER",
                verify: true,
            });
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "user created",
                data: user,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `you are not an admin`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error creating user ${error}`,
        });
    }
});
exports.registerUser = registerUser;
const registerBuyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, address, telNumb } = req.body;
        const salt = yield (0, bcryptjs_1.genSalt)(2);
        const harsh = yield (0, bcryptjs_1.hash)(password, salt);
        const buyer = yield userMode_1.default.create({
            name,
            email,
            address,
            telNumb,
            password: harsh,
            role: "BUYER",
            verify: true,
        });
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

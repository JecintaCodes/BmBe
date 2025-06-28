import { Router } from "express";
import {
  contactMail,
  deleteBuyerAndAdmin,
  getAllUser,
  getOneUser,
  getTotalUser,
  getUserStore,
  registerAdmin,
  registerBuyer,
  registerUser,
  searchDataBase,
  searchListOrder,
  searchOrder,
  sendVerificationCode,
  signInUser,
  updateUserdescription,
  updateUserImage,
  updateUserInfo,
  updateUserName,
  verifyEmail,
  verifyUserAccount,
} from "../controller/userController";
import multer from "multer";
const upload = multer().single("image");
console.log(upload);
const userRouter = Router();

userRouter.route("/:adminID/register-users").post(registerUser);

userRouter.route("/register-admin").post(registerAdmin);
userRouter.route("/register-buyer").post(registerBuyer);

userRouter.route("/sign-in-user").post(signInUser);
userRouter.route("/contact-mail").post(contactMail);

userRouter.route("/get-all-user").get(getAllUser);
// userRouter.route("/forget-password").get(forgetUserPassword);
userRouter.route("/resend-code").post(sendVerificationCode);
userRouter.route("/verify/:verificationToken").get(verifyEmail);

userRouter.route("/:userID/get-one-user").get(getOneUser);
userRouter.route("/delete-user").delete(deleteBuyerAndAdmin);
userRouter.route("/:userID/update-image").patch(upload, updateUserImage);
userRouter.route("/:userID/update-name").patch(updateUserName);
userRouter.route("/:userID/verifyToken").patch(verifyUserAccount);
userRouter.route("/:userID/update-detail").patch(updateUserdescription);
userRouter.route("/:userID/update-info").patch(upload, updateUserInfo);
userRouter.route("/search-users").get(searchDataBase);
userRouter.route("/search-orders").get(searchOrder);
userRouter.route("/search-list").get(searchListOrder);
userRouter.route("/total-user").get(getTotalUser);
userRouter.route("/:userID/user-store").get(getUserStore);
export default userRouter;

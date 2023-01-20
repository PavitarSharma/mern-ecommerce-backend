import express from "express";
import {
  forgotPassword,
  loginWithOTP,
  logout,
  refreshToken,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from "../controllers/auth.controller.js";
import { isAuthintacted } from "../middlewares/auth.js";
import fileExtLimiter from "../middlewares/fileExtLimiter.js";
import fileSizeLimiter from "../middlewares/fileSizeLimiter.js";
import filesPayloadExists from "../middlewares/filesPayloadExists.js";

const router = express.Router();

router.post(
  "/register",
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg", ".JPG", ".JPEG", ".PNG", ".gif"]),
  fileSizeLimiter,
  signUp
);

router.post("/login", signIn);

router.get("/refresh-token", refreshToken);

router.post("/login-otp", loginWithOTP);

router.post("/password/forgot", forgotPassword);

router.put("/password/reset/:token", resetPassword);

router.put("/password/update", updatePassword);

router.post("/logout",isAuthintacted, logout);

export default router;

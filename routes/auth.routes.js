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
const router = express.Router();

router.post("/register", signUp);

router.post("/login", signIn);

router.get("/refresh-token", refreshToken)

router.post("/login-otp", loginWithOTP);

router.post("/password/forgot", forgotPassword)

router.post("/password/reset/:token", resetPassword)

router.post("/password/update", updatePassword)

router.post("/logout", logout);

export default router;

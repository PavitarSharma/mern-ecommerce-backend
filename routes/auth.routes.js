import express from "express";
import {
  loginWithOTP,
  logout,
  refreshToken,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", signUp);

router.post("/login", signIn);

router.get("/refresh-token", refreshToken)

router.post("/login-otp", loginWithOTP);

router.delete("/logout", logout);

export default router;

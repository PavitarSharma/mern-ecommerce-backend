import express from "express";
import {
  loginWithOTP,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", signUp);

router.post("/login", signIn);

router.post("/login-otp", loginWithOTP);

export default router;

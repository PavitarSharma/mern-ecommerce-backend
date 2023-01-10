import User from "../models/User.model.js";

export const signUp = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user",
    });
  } catch (error) {}
};

export const signIn = async (req, res, next) => {
  try {
    res.json({
      message: "Sign in user",
    });
  } catch (error) {}
};

export const googleAuth = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user with Google",
    });
  } catch (error) {}
};

export const githubAuth = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user with GitHub",
    });
  } catch (error) {}
};

export const twitterAuth = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user with Twitter",
    });
  } catch (error) {}
};

export const loginWithOTP = async (req, res, next) => {
  try {
    res.json({
      message: "Loin With mobile",
    });
  } catch (error) {}
};

export const forgotPassword = async (req, res, next) => {
  try {
    res.json({
      message: "Forgot Password",
    });
  } catch (error) {}
};

export const resetPassword = async (req, res, next) => {
  try {
    res.json({
      message: "Reset Password",
    });
  } catch (error) {}
};

export const verificationEmail = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user with Google",
    });
  } catch (error) {}
};

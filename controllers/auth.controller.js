import User from "../models/User.model.js";
import cloudinary from "../helpers/cloudinary.js";
import { signUpSchema } from "../helpers/validation/user.validation.js";
import createError from "http-errors";

export const signUp = async (req, res, next) => {
  try {
    const { error } = signUpSchema(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const { username, email, password, avatar } = req.body;

    const doesExit = await User.findOne({ email: email });
    if (doesExit) {
      throw createError.Conflict("This email is already exits!");
    }
const file = req.files.avatar

    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${Date.now()}`,
      folder: "avatars",
    });

    const user = new User({
      username,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    const result = await user.save();

    res.status(200).json({
      message: "User registeration successfully done",
      result,
    });
  } catch (error) {

    if (error.isJoi === true) error.status = 422;
    next(error);
  }
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

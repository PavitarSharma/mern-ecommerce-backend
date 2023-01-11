import User from "../models/User.model.js";
import cloudinary from "../helpers/cloudinary.js";
import jwt from "jsonwebtoken";
import {
  signInSchema,
  signUpSchema,
} from "../helpers/validation/user.validation.js";
import createError from "http-errors";
import { signAccessToken, signRefreshToken } from "../helpers/jwt.helper.js";

export const signUp = async (req, res, next) => {
  try {
    const { error } = signUpSchema(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const { username, email, password } = req.body;

    const doesExit = await User.findOne({ email: email });
    if (doesExit) {
      throw createError.Conflict("This email is already exits!");
    }
    const file = req.files.avatar;

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

    await user.save();
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({
      message: "User registeration successfully done",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { error } = signInSchema(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) throw createError.NotFound("User not found");

    const isMatchPassword = await user.isValidPassword(req.body.password);

    if (!isMatchPassword)
      throw createError.Unauthorized("Username/password not valid");

    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
 

    const { password, ...data } = user._doc;
    res.status(200).json({
      message: "User looged in successfully",
      accessToken,
      refreshToken,
      data,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw createError.Unauthorized();
    }
    // res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) throw createError.Forbidden();

        const user = await User.findById({ _id: payload._id }).exec();

        if (!user) throw createError.Unauthorized();
        const accessToken = await signAccessToken(user);
        res.status(200).json({
          accessToken,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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

export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "User logout successfully" });
};

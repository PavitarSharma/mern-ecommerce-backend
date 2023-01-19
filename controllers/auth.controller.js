import User from "../models/User.model.js";
import cloudinary from "../helpers/cloudinary.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {
  signInSchema,
  signUpSchema,
} from "../helpers/validation/user.validation.js";
import createError from "http-errors";
import { signAccessToken, signRefreshToken } from "../helpers/jwt.helper.js";
import { sendUser } from "../helpers/sendUser.js";
import ErrorHandler from "../helpers/errorHandler.js";
import sendMail from "../helpers/sendMail.js";

const cookieOption = {
  httpOnly: true, //accessible only by web server
  secure: true, //https
  sameSite: "None", //cross-site cookie
  maxAge: 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
};

export const signUp = asyncHandler(async (req, res, next) => {
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

    let user = new User({
      username,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    await user.save();

    res.status(201).json({
      message: "User registeration successfully done",
      user,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

export const signIn = asyncHandler(async (req, res, next) => {
  try {
    const { error } = signInSchema(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const cookies = req.cookies;
    const user = await User.findOne({ email: req.body.email });

    if (!user) throw createError.NotFound("User not found");

    const isMatchPassword = await user.isValidPassword(req.body.password);

    if (!isMatchPassword)
      throw createError.Unauthorized("Username/password not valid");

    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);
    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        console.log("attempted refresh token reuse at login");
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    res.cookie("jwt", refreshToken, cookieOption);

    // const { password, ...data } = user._doc;
    res.status(200).json({
      message: "User looged in successfully",
      accessToken,
      refreshToken,
      user: sendUser(user),
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

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

        const user = await User.findById({ _id: payload.id }).exec();

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

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter old & new password", 400));

  const user = await User.findById(req.userInfo.userId).select("+password");
  const isPasswordMatched = await user.isValidPassword(oldPassword);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Old password is incorrect", 400));

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get ResetPassword Token

  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "Reset password url is invalid or has been expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password is not matched with the new password", 400)
      );
    }

    user.password = req.body.password;
    // const accessToken = await signAccessToken(user);
    // const refreshToken = await signRefreshToken(user);

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();
    // res.cookie("jwt", refreshToken, cookieOption);
    res.send(200).json({
      success: true,
      message: "Reset Password"
    });
  } catch (error) {
    res.send(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const verificationEmail = async (req, res, next) => {
  try {
    res.json({
      message: "Sign up user with Google",
    });
  } catch (error) {}
};

export const logout = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(200).json({ success: true, message: "Logged out" });
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).json({ success: true, message: "Logged out" });
  }
  user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
  await user.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ success: true, message: "Logged out" });
});

import User from "../models/User.model.js";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../helpers/errorHandler.js";
import cloudinary from "../helpers/cloudinary.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select([
      "-refreshToken",
      "-password",
      "-fromGoogle",
      "-fromGitHub",
      "-fromTwitter",
    ]);

    if (!user) {
      return next(new ErrorHandler("User does not exit", 404));
    }
    res.json({
      succes: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 500));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.userInfo;
    const users = await User.find({ _id: { $ne: userId } }).select(
      "-refreshToken"
    );

    if (!users) {
      return next(new ErrorHandler("Data not found", 404));
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 404));
  }
};

export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const newUserData = {
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      status: req.body.status,
      gender: req.body.gender,
      githublink: req.body.githublink,
      twitterLink: req.body.twitterLink,
      linkedinLink: req.body.linkedinLink,
      facebookLink: req.body.facebookLink,
    };

    let user = await User.findById(req.userInfo.userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (req.files) {
      const imageId = user.avatar.public_id;

      const remove = await cloudinary.uploader.destroy(imageId);
      const file = req.files.avatar;
      if (remove) {
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
          public_id: `${Date.now()}`,
          folder: "avatars",
        });
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

        await user.save();
      }
    }

    user = await User.findByIdAndUpdate(req.userInfo.userId, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.json({
      success: true,
      message: "Update user successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler("Not procceded.Try again later.", 500));
  }
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  try {
    const { roles, store, blocked } = req.body;
    const { userId } = req.userInfo;

    if (roles === "seller") {
      if (!store) return next(new ErrorHandler("Plese specify a store", 400));

      if (!(await store.findById(store)))
        return next(new ErrorHandler("Store not found", 404));

      await User.findByIdAndUpdate(
        req.params.id,
        {
          roles,
          store,
          updatedBy: userId,
          blocked,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    } else {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          roles,
          updatedBy: userId,
          blocked,
          $unset: { store: "" },
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const activeOrder = await Order.findOne({ user: id });
    if (activeOrder) return next(new ErrorHandler("User not deleted", 400));

    const activeProduct = await Product.findOne({
      $or: [{ addedBy: id }, { updatedBy: id }],
    });
    if (activeProduct) return next(new ErrorHandler("User not deleted", 400));

    const imageId = user.avatar.public_id;

    await cloudinary.uploader.destroy(imageId);

    await user.remove();
    res.status(200).json({ success: true, message: "User deleted." });
    
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

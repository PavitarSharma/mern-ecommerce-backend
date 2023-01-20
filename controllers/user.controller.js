import User from "../models/User.model.js";
import asyncHandler from "express-async-handler";

export const getUser = async (req, res, next) => {
  try {
    res.json({
      message: "Sget one user",
    });
  } catch (error) {}
};

export const getAllUsers = async (req, res, next) => {
  try {
    res.json({
      message: "Get ",
    });
  } catch (error) {}
};

export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    res.json({
      message: "Update User",
    });
  } catch (error) {}
});

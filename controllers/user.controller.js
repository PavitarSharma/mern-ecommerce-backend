import User from "../models/User.model.js";

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

export const updateUser = async (req, res, next) => {
  try {
    res.json({
      message: "Update User",
    });
  } catch (error) {}
};

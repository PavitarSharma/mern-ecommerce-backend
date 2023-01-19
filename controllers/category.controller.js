import Category from "../models/Category.model.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../helpers/errorHandler.js";

export const addCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    category,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(201).json({
    success: true,
    categories,
  });
});

export const getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  res.status(201).json({
    success: true,
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    throw createError.NotFound("Category not found");
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    throw createError.NotFound("Category not found");
  }

  await category.remove();
  res.status(201).json({
    success: true,
    message: "Category deleted successfully",
  });
});

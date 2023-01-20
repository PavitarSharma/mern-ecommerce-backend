import Brand from "../models/Brand.model.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../helpers/errorHandler.js";
import Product from "../models/Product.model.js";

export const addBrand = asyncHandler(async (req, res) => {
  req.body.addedBy = req.userInfo.userId;
  const brand = await Brand.create(req.body);
  res.status(201).json({
    success: true,
    brand,
  });
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.status(200).json({
    success: true,
    brands,
  });
});

export const getSingleBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new ErrorHandler("Brand not found", 404));
  }
  res.status(200).json({
    success: true,
    brand,
  });
});

export const updateBrand = asyncHandler(async (req, res) => {
  req.body.updatedBy = req.userInfo.userId;
  let brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw createError.NotFound("Brand not found");
  }

  brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    brand,
  });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  let brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw createError.NotFound("Brand not found");
  }

  const active = await Product.findOne({ brand: req.params.id });
  if (active)
    return next(new ErrorHandler("Brand is used.Could not deleted.", 406));

  await Brand.remove();
  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});

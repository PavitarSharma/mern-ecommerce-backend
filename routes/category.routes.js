import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/categories").post(addCategory).get(getCategories);

router
  .route("/categories/:id")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;

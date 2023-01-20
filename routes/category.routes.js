import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles, isAuthintacted } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/categories")
  .post(isAuthintacted, authorizeRoles("admin"), addCategory)
  .get(getCategories);

router
  .route("/categories/:id")
  .get(getSingleCategory)
  .put(isAuthintacted, authorizeRoles("admin"), updateCategory)
  .delete(isAuthintacted, authorizeRoles("admin"), deleteCategory);

export default router;

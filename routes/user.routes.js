import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  updateUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { authorizeRoles, isAuthintacted } from "../middlewares/auth.js";
import fileExtLimiter from "../middlewares/fileExtLimiter.js";
import fileSizeLimiter from "../middlewares/fileSizeLimiter.js";

const router = express.Router();

router.get("/", isAuthintacted, authorizeRoles("admin"), getAllUsers);

router
  .route("/:id")
  .get(isAuthintacted, getUserDetails)
  .put(isAuthintacted, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthintacted, authorizeRoles("admin"), deleteUser);

router.put(
  "/update",
  isAuthintacted,
  fileExtLimiter([".png", ".jpg", ".jpeg", ".JPG", ".JPEG", ".PNG", ".gif"]),
  fileSizeLimiter,
  updateUser
);

export default router;

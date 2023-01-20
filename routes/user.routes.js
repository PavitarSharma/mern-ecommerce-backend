import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { isAuthintacted } from "../middlewares/auth.js";

const router = express.Router();



router.get("/", getAllUsers);

router.post("/:id", getUser);

router.put("/:id",isAuthintacted, updateUser);

export default router;

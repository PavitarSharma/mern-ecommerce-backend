import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", getAllUsers);

router.post("/:id", getUser);

router.put("/:id", updateUser);

export default router;

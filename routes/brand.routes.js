import express from "express";
import {
  addBrand,
  deleteBrand,
  getBrands,
  getSingleBrand,
  updateBrand,
} from "../controllers/brand.controller.js";
import { authorizeRoles, isAuthintacted } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/brands")
  .post(isAuthintacted, authorizeRoles("admin"), addBrand)
  .get(getBrands);

router
  .route("/brands/:id")
  .get(getSingleBrand)
  .put(isAuthintacted, authorizeRoles("admin"), updateBrand)
  .delete(isAuthintacted, authorizeRoles("admin"), deleteBrand);

export default router;

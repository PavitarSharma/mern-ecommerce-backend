import express from "express";
import { addBrand, deleteBrand, getBrands, getSingleBrand, updateBrand } from "../controllers/brand.controller.js";


const router = express.Router();

router.route("/brands").post(addBrand).get(getBrands);

router
  .route("/brands/:id")
  .get(getSingleBrand)
  .put(updateBrand)
  .delete(deleteBrand);

export default router;

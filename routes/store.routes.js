import express from "express";
import {
  addStore,
  deleteStore,
  getStoreDetails,
  getStores,
  updateStore,
} from "../controllers/store.controller.js";
import { authorizeRoles, isAuthintacted } from "../middlewares/auth.js";
import fileExtLimiter from "../middlewares/fileExtLimiter.js";
import filesPayloadExists from "../middlewares/filesPayloadExists.js";

const router = express.Router();

router
  .route("/stores")
  .post(
    isAuthintacted,
    authorizeRoles("admin"),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg", ".JPG", ".JPEG", ".PNG", ".gif"]),
    addStore
  )
  .get(isAuthintacted, authorizeRoles("admin", "seller"), getStores);

router
  .route("/stores/:id")
  .get(isAuthintacted, authorizeRoles("admin", "seller"), getStoreDetails)
  .put(
    isAuthintacted,
    authorizeRoles("admin", "seller"),
    fileExtLimiter([".png", ".jpg", ".jpeg", ".JPG", ".JPEG", ".PNG", ".gif"]),
    updateStore
  )
  .delete(isAuthintacted, authorizeRoles("admin"), deleteStore);

export default router;

import express from "express";
import {
  getAllWilayas,
  getWilayaById,
  createWilaya,
  updateWilaya,
  deleteWilaya
} from "../controllers/wilayaController.js";

const router = express.Router();

// Routes CRUD
router.get("/", getAllWilayas);
router.get("/:id", getWilayaById);
router.post("/", createWilaya);
router.put("/:id", updateWilaya);
router.delete("/:id", deleteWilaya);

export default router; // ✅ très important

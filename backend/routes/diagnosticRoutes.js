import express from "express";
import {
  getAllDiagnostics,
  getDiagnosticById,
  createDiagnostic,
  updateDiagnostic,
  deleteDiagnostic
} from "../controllers/diagnosticController.js";

const router = express.Router();

router.get("/", getAllDiagnostics);
router.get("/:id", getDiagnosticById);
router.post("/", createDiagnostic);
router.put("/:id", updateDiagnostic);
router.delete("/:id", deleteDiagnostic);

export default router; // <--- TRÈS IMPORTANT


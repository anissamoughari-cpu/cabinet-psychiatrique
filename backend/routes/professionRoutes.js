// routes/professionRoutes.js
import express from "express";
import {
  getAllProfessions,
  getProfessionById,
  createProfession,
  updateProfession,
  deleteProfession
} from "../controllers/professionController.js";

const router = express.Router();

// ✅ Routes CRUD pour les professions
router.get("/", getAllProfessions);
router.get("/:id", getProfessionById);
router.post("/", createProfession);
router.put("/:id", updateProfession);
router.delete("/:id", deleteProfession);

// 🟢 Très important : export par défaut
export default router;

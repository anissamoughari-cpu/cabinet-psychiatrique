// routes/maladieRoutes.js
import express from "express";
import {
  getAllMaladies,
  getMaladieById,
  createMaladie,
  updateMaladie,
  deleteMaladie,
} from "../controllers/maladieController.js";

const router = express.Router();

// ✅ Routes pour les maladies
router.get("/", getAllMaladies);
router.get("/:id", getMaladieById);
router.post("/", createMaladie);
router.put("/:id", updateMaladie);
router.delete("/:id", deleteMaladie);

// 🔥 C'est cette ligne qui manquait ou était incorrecte !
export default router;

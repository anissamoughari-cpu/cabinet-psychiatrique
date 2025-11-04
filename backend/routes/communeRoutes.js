import express from "express";
import {
  getAllCommunes,
  getCommuneById,
  createCommune,
  updateCommune,
  deleteCommune
} from "../controllers/communeController.js";

const router = express.Router();

router.get("/", getAllCommunes);
router.get("/:id", getCommuneById);
router.post("/", createCommune);
router.put("/:id", updateCommune);
router.delete("/:id", deleteCommune);

export default router;

import express from "express";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from "../controllers/patientController.js";

const router = express.Router();

// Récupérer tous les patients
router.get("/", getAllPatients);

// Récupérer un patient par ID
router.get("/:id", getPatientById);

// Créer un nouveau patient
router.post("/", createPatient);

// Mettre à jour un patient existant
router.put("/:id", updatePatient);

// Supprimer un patient
router.delete("/:id", deletePatient);

export default router;




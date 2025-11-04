import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  genre: { type: String, required: true },
  telephone: { type: String },
  adresse: { type: String },
  email: { type: String },
  profession: { type: String },
  situationFamiliale: { type: String },
  antecedentsMedicaux: { type: String },
  allergies: { type: String },
  groupeSanguin: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);

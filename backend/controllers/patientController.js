import db from "../config/db.js";

// 🟢 Lire tous les patients
export const getAllPatients = (req, res) => {
  const sql = "SELECT * FROM patients";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.json(result);
  });
};

// 🟢 Lire un patient par ID
export const getPatientById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patients WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }
    res.json(result[0]);
  });
};

// 🟢 Créer un patient
export const createPatient = (req, res) => {
  const { firstName, lastName, age, gender, email, phone } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  const sql = "INSERT INTO patients (firstName, lastName, age, gender, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, age, gender, email, phone], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la création du patient", error: err });
    }
    res.status(201).json({ message: "Patient créé avec succès", patientId: result.insertId });
  });
};

// 🟢 Mettre à jour un patient
export const updatePatient = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, gender, email, phone } = req.body;

  const sql = "UPDATE patients SET firstName=?, lastName=?, age=?, gender=?, email=?, phone=? WHERE id=?";
  db.query(sql, [firstName, lastName, age, gender, email, phone, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
    res.json({ message: "Patient mis à jour avec succès" });
  });
};

// 🟢 Supprimer un patient
export const deletePatient = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM patients WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression", error: err });
    }
    res.json({ message: "Patient supprimé avec succès" });
  });
};





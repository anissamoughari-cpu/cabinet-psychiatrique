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
  const {
    nom,
    prenom,
    age,
    genre,
    wilaya,
    telephone,
    numeroDossierAuto,
    numeroDossierManuel,
    profession
  } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({ message: "Nom et prénom sont obligatoires" });
  }

  const sql = `
    INSERT INTO patients (nom, prenom, age, genre, wilaya, telephone, numeroDossierAuto, numeroDossierManuel, profession)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nom, prenom, age, genre, wilaya, telephone, numeroDossierAuto, numeroDossierManuel, profession], (err, result) => {
    if (err) {
      console.error("Erreur lors de la création :", err);
      return res.status(500).json({ message: "Erreur lors de la création du patient", error: err });
    }
    res.status(201).json({ message: "Patient créé avec succès", patientId: result.insertId });
  });
};

// 🟢 Mettre à jour un patient
export const updatePatient = (req, res) => {
  const { id } = req.params;
  const {
    nom,
    prenom,
    age,
    genre,
    wilaya,
    telephone,
    numeroDossierAuto,
    numeroDossierManuel,
    profession
  } = req.body;

  const sql = `
    UPDATE patients
    SET nom=?, prenom=?, age=?, genre=?, wilaya=?, telephone=?, numeroDossierAuto=?, numeroDossierManuel=?, profession=?
    WHERE id=?
  `;
  db.query(sql, [nom, prenom, age, genre, wilaya, telephone, numeroDossierAuto, numeroDossierManuel, profession, id], (err, result) => {
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

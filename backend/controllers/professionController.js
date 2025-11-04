// controllers/professionController.js
import db from "../config/db.js";

// 🟢 Lire toutes les professions
export const getAllProfessions = (req, res) => {
  const sql = "SELECT * FROM professions";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json(results);
  });
};

// 🟢 Lire une profession par ID
export const getProfessionById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM professions WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Profession non trouvée" });
    res.json(results[0]);
  });
};

// 🟢 Créer une profession
export const createProfession = (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ message: "Le champ nom est obligatoire" });

  const sql = "INSERT INTO professions (nom) VALUES (?)";
  db.query(sql, [nom], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la création", error: err });
    res.status(201).json({ message: "Profession ajoutée avec succès", id: result.insertId });
  });
};

// 🟢 Mettre à jour une profession
export const updateProfession = (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;

  const sql = "UPDATE professions SET nom = ? WHERE id = ?";
  db.query(sql, [nom, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    res.json({ message: "Profession mise à jour avec succès" });
  });
};

// 🟢 Supprimer une profession
export const deleteProfession = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM professions WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la suppression", error: err });
    res.json({ message: "Profession supprimée avec succès" });
  });
};

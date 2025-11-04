// controllers/maladieController.js
import db from "../config/db.js";

// ✅ Récupérer toutes les maladies
export const getAllMaladies = (req, res) => {
  const sql = "SELECT * FROM maladies";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// ✅ Récupérer une maladie par ID
export const getMaladieById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM maladies WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Maladie non trouvée" });
    res.json(result[0]);
  });
};

// ✅ Créer une nouvelle maladie
export const createMaladie = (req, res) => {
  const { nom, description } = req.body;
  const sql = "INSERT INTO maladies (nom, description) VALUES (?, ?)";
  db.query(sql, [nom, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nom, description });
  });
};

// ✅ Mettre à jour une maladie
export const updateMaladie = (req, res) => {
  const { id } = req.params;
  const { nom, description } = req.body;
  const sql = "UPDATE maladies SET nom = ?, description = ? WHERE id = ?";
  db.query(sql, [nom, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Maladie mise à jour avec succès" });
  });
};

// ✅ Supprimer une maladie
export const deleteMaladie = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM maladies WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Maladie supprimée avec succès" });
  });
};

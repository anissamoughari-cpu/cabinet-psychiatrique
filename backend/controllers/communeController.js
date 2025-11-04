import db from "../config/db.js";

// 🔹 Récupérer toutes les communes
export const getAllCommunes = (req, res) => {
  const sql = `
    SELECT communes.*, wilayas.nom AS wilaya_nom
    FROM communes
    LEFT JOIN wilayas ON communes.wilaya_id = wilayas.id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json(result);
  });
};

// 🔹 Récupérer une commune par ID
export const getCommuneById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM communes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Commune non trouvée" });
    res.json(result[0]);
  });
};

// 🔹 Créer une commune
export const createCommune = (req, res) => {
  const { nom, wilaya_id } = req.body;
  if (!nom || !wilaya_id) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  const sql = "INSERT INTO communes (nom, wilaya_id) VALUES (?, ?)";
  db.query(sql, [nom, wilaya_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la création", error: err });
    res.status(201).json({ message: "Commune créée avec succès", id: result.insertId });
  });
};

// 🔹 Mettre à jour une commune
export const updateCommune = (req, res) => {
  const { id } = req.params;
  const { nom, wilaya_id } = req.body;
  const sql = "UPDATE communes SET nom = ?, wilaya_id = ? WHERE id = ?";
  db.query(sql, [nom, wilaya_id, id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    res.json({ message: "Commune mise à jour avec succès" });
  });
};

// 🔹 Supprimer une commune
export const deleteCommune = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM communes WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la suppression", error: err });
    res.json({ message: "Commune supprimée avec succès" });
  });
};

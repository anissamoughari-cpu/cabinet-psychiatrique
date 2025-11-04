import db from "../config/db.js";

// 🟢 Lire toutes les wilayas
export const getAllWilayas = (req, res) => {
  const sql = "SELECT * FROM wilayas";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json(result);
  });
};

// 🟢 Lire une wilaya par ID
export const getWilayaById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM wilayas WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Wilaya non trouvée" });
    res.json(result[0]);
  });
};

// 🟢 Créer une wilaya
export const createWilaya = (req, res) => {
  const { code, nom } = req.body;

  if (!code || !nom) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  const sql = "INSERT INTO wilayas (code, nom) VALUES (?, ?)";
  db.query(sql, [code, nom], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la création de la wilaya", error: err });
    }
    res.status(201).json({ message: "Wilaya créée avec succès", wilayaId: result.insertId });
  });
};

// 🟢 Mettre à jour une wilaya
export const updateWilaya = (req, res) => {
  const { id } = req.params;
  const { code, nom } = req.body;

  const sql = "UPDATE wilayas SET code = ?, nom = ? WHERE id = ?";
  db.query(sql, [code, nom, id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    res.json({ message: "Wilaya mise à jour avec succès" });
  });
};

// 🟢 Supprimer une wilaya
export const deleteWilaya = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM wilayas WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la suppression", error: err });
    res.json({ message: "Wilaya supprimée avec succès" });
  });
};

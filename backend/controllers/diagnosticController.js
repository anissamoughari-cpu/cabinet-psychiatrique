import db from "../config/db.js";

export const getAllDiagnostics = (req, res) => {
  db.query("SELECT * FROM diagnostics", (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur récupération", error: err });
    res.json(results);
  });
};

export const getDiagnosticById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM diagnostics WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur récupération", error: err });
    res.json(results[0]);
  });
};

export const createDiagnostic = (req, res) => {
  const { patientId, maladieId, diagnosticText } = req.body;

  db.query(
    "INSERT INTO diagnostics (patientId, maladieId, diagnosticText) VALUES (?, ?, ?)",
    [patientId, maladieId, diagnosticText],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur création", error: err });
      res.json({ message: "✅ Diagnostic ajouté avec succès", id: result.insertId });
    }
  );
};

export const updateDiagnostic = (req, res) => {
  const { id } = req.params;
  const { patientId, maladieId, diagnosticText } = req.body;

  db.query(
    "UPDATE diagnostics SET patientId = ?, maladieId = ?, diagnosticText = ? WHERE id = ?",
    [patientId, maladieId, diagnosticText, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur mise à jour", error: err });
      res.json({ message: "✅ Diagnostic mis à jour avec succès" });
    }
  );
};

export const deleteDiagnostic = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM diagnostics WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur suppression", error: err });
    res.json({ message: "✅ Diagnostic supprimé avec succès" });
  });
};

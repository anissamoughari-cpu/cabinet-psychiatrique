import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db.js";

// 📌 Routes
import patientRoutes from "./routes/patientRoutes.js";
import maladieRoutes from "./routes/maladieRoutes.js";
import professionRoutes from "./routes/professionRoutes.js";
import wilayaRoutes from "./routes/wilayaRoutes.js";
import communeRoutes from "./routes/communeRoutes.js";
import diagnosticRoutes from "./routes/diagnosticRoutes.js"; // ✅ TRÈS IMPORTANT

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connexion MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL avec succès !");
  }
});

// ✅ Enregistrement des routes API
app.use("/api/patients", patientRoutes);
app.use("/api/maladies", maladieRoutes);
app.use("/api/professions", professionRoutes);
app.use("/api/wilayas", wilayaRoutes);
app.use("/api/communes", communeRoutes);
app.use("/api/diagnostics", diagnosticRoutes); // ✅ ICI (avant lancement serveur)

// ✅ Lancement du serveur
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});

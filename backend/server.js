import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db.js";

// 🟢 Import des routes
import patientRoutes from "./routes/patientRoutes.js";
import maladieRoutes from "./routes/maladieRoutes.js";
import professionRoutes from "./routes/professionRoutes.js";
import wilayaRoutes from "./routes/wilayaRoutes.js"; // ✅ ajoute ceci
import communeRoutes from "./routes/communeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion MySQL
db.connect((err) => {
  if (err) console.error("❌ Erreur MySQL :", err);
  else console.log("✅ Connecté à MySQL avec succès !");
});

// 🟢 Déclaration des routes
app.use("/api/patients", patientRoutes);
app.use("/api/maladies", maladieRoutes);
app.use("/api/professions", professionRoutes);
app.use("/api/wilayas", wilayaRoutes); // ✅ ajoute ceci
app.use("/api/communes", communeRoutes);

// Lancer serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));

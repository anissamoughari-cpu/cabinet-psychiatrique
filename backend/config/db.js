import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "nodeuser",
  password: "nodepass",
  database: "cabinetDB",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL avec succès !");
  }
});

export default db;

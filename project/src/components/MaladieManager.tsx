import React, { useEffect, useState } from "react";
import { getMaladies, addMaladie, deleteMaladie } from "../services/maladieService";

const MaladieManager: React.FC = () => {
  const [maladies, setMaladies] = useState<any[]>([]);
  const [nouvelleMaladie, setNouvelleMaladie] = useState("");

  useEffect(() => {
    loadMaladies();
  }, []);

  const loadMaladies = async () => {
    const data = await getMaladies();
    setMaladies(data);
  };

  const handleAdd = async () => {
    if (nouvelleMaladie.trim() === "") return;
    await addMaladie(nouvelleMaladie);
    setNouvelleMaladie("");
    loadMaladies();
  };

  const handleDelete = async (id: number) => {
    await deleteMaladie(id);
    loadMaladies();
  };

  return (
    <div>
      <h2>Gestion des Maladies</h2>

      <input
        type="text"
        value={nouvelleMaladie}
        onChange={(e) => setNouvelleMaladie(e.target.value)}
        placeholder="Ajouter une maladie..."
      />
      <button onClick={handleAdd}>Ajouter</button>

      <ul>
        {maladies.map((m) => (
          <li key={m.id}>
            {m.nom} <button onClick={() => handleDelete(m.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaladieManager;

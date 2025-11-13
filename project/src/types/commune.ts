export interface Commune {
  id: number;
  nom: string;
  wilaya_id: number;
  wilaya_nom?: string; // Pour afficher le nom de la wilaya
}

export interface CommuneFormData {
  nom: string;
  wilaya_id: number;
}
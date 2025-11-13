// src/types/profession.ts
export interface Profession {
  id: number;
  nom: string;
  secteur: string;
  description?: string;
}

export interface ProfessionFormData {
  nom: string;
  secteur: string;
  description?: string;
}
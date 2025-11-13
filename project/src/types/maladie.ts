// src/types/maladie.ts
export interface Maladie {
  id: number;
  nom: string;
  description: string;
  code?: string; // Optionnel
}

export interface MaladieFormData {
  nom: string;
  description: string;
  code?: string;
}
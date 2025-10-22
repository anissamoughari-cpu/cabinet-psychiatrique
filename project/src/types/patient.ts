export interface Patient {
  // Identifiant Unique
  numeroDossierAuto: string;
  numeroDossierManuel?: string;
  
  // Identité Civile
  nom: string;
  prenom: string;
  dateNaissance: string;
  age?: number;
  communeNaissance?: string;
  genre: 'Femme' | 'Homme' | 'Autre/Non spécifié' | '';
  
  // Situation Familiale
  situationFamiliale: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve' | 'Concubinage' | 'PACSé(e)' | '';
  nombreEnfants?: number;
  
  // Coordonnées
  telephone?: string;
  adresse?: string;
  wilaya: string;
  commune: string;
  
  // Informations Professionnelles
  profession?: string;
  numeroCarteIdentite?: string;
  communeDelivranceCarte?: string;
  wilayaDelivranceCarte: string;
  dateDelivranceCarte?: string;
  photo?: string;
  
  // Antécédents et Examens
  antecedent?: string;
  antecedentSymptomes?: string[];
  examenPhysique?: string;
  examenPhysiqueSymptomes?: string[];
  examenMental?: string;
  examenMentalSymptomes?: string[];
  
  // Traitement
  traitement?: string;
  traitementPredefinies?: string[];
  maladie?: string;
  diagnostic?: string;
  diagnosticMaladies?: string[];
  diagnosticFinal?: string;
}

export interface Wilaya {
  code: string;
  nom: string;
  communes: string[];
}
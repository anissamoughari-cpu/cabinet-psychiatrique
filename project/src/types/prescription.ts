export interface PrescriptionTemplate {
  id: string;
  name: string;
  doctorId: string;
  isDefault: boolean;
  header: {
    logo?: string;
    doctorName: string;
    specialty: string;
    address: string;
    phone: string;
    email?: string;
    registrationNumber: string;
  };
  body: {
    introduction: string;
    instructions: string;
    legalMentions: string;
  };
  footer: {
    signature: string;
    additionalInfo?: string;
  };
  sections: {
    showDiagnosis: boolean;
    showAntecedents: boolean;
    showTreatment: boolean;
    showRecommendations: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  templateId: string;
  doctorId: string;
  patientInfo: {
    name: string;
    firstName: string;
    age: number;
    gender: string;
  };
  diagnosis: string;
  antecedents: string;
  treatments: PrescriptionTreatment[];
  recommendations: string;
  additionalNotes: string;
  createdAt: string;
  status: 'draft' | 'finalized' | 'printed';
}

export interface PrescriptionTreatment {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Doctor {
  id: string;
  name: string;
  firstName: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  defaultTemplateId?: string;
}
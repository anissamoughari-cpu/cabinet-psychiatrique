// src/types/prescription.ts
export interface PrescriptionField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'medication';
  required: boolean;
}

export interface PrescriptionTemplate {
  id: string;
  name: string;
  doctorName: string;
  doctorAddress: string;
  doctorPhone: string;
  doctorSpecialty: string;
  logo?: string; // base64 image
  fields: PrescriptionField[];
  createdAt: string;
}
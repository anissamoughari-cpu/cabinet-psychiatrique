import { Patient } from '../types/patient';

export const generatePatientId = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PSY-${year}-${randomNum}`;
};

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Validation pour numéros algériens (05, 06, 07) + fixes
  const phoneRegex = /^(0[5-7]\d{8}|0[1-4]\d{7})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};
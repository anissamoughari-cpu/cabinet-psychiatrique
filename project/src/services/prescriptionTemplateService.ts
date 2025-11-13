// src/services/prescriptionTemplateService.ts
import { PrescriptionTemplate } from '../types/prescription';

// Pour l'instant, on stocke en local storage
export const prescriptionTemplateService = {
  saveTemplate: (template: PrescriptionTemplate): void => {
    const templates = prescriptionTemplateService.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem('prescription-templates', JSON.stringify(templates));
  },

  getTemplates: (): PrescriptionTemplate[] => {
    const stored = localStorage.getItem('prescription-templates');
    return stored ? JSON.parse(stored) : [];
  },

  getTemplate: (id: string): PrescriptionTemplate | undefined => {
    const templates = prescriptionTemplateService.getTemplates();
    return templates.find(t => t.id === id);
  },

  deleteTemplate: (id: string): void => {
    const templates = prescriptionTemplateService.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem('prescription-templates', JSON.stringify(filtered));
  }
};
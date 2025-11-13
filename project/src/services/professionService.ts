import api from './api';
import { Profession, ProfessionFormData } from '../types/profession';

// Export par défaut
const professionService = {
  async getAll(): Promise<Profession[]> {
    try {
      const response = await api.get('/professions');
      return response.data;
    } catch (error) {
      console.error('Erreur dans professionService.getAll:', error);
      throw error;
    }
  },

  async create(profession: ProfessionFormData): Promise<Profession> {
    try {
      const response = await api.post('/professions', profession);
      return response.data;
    } catch (error) {
      console.error('Erreur dans professionService.create:', error);
      throw error;
    }
  },

  async update(id: number, profession: ProfessionFormData): Promise<Profession> {
    try {
      const response = await api.put(`/professions/${id}`, profession);
      return response.data;
    } catch (error) {
      console.error('Erreur dans professionService.update:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/professions/${id}`);
    } catch (error) {
      console.error('Erreur dans professionService.delete:', error);
      throw error;
    }
  }
};

// Export par défaut
export default professionService;
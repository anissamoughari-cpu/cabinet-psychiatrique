import api from './api';
import { Maladie, MaladieFormData } from '../types/maladie';

// Export par défaut au lieu d'export nommé
const maladieService = {
  async getAll(): Promise<Maladie[]> {
    try {
      const response = await api.get('/maladies');
      return response.data;
    } catch (error) {
      console.error('Erreur dans maladieService.getAll:', error);
      throw error;
    }
  },

  async create(maladie: MaladieFormData): Promise<Maladie> {
    try {
      const response = await api.post('/maladies', maladie);
      return response.data;
    } catch (error) {
      console.error('Erreur dans maladieService.create:', error);
      throw error;
    }
  },

  async update(id: number, maladie: MaladieFormData): Promise<Maladie> {
    try {
      const response = await api.put(`/maladies/${id}`, maladie);
      return response.data;
    } catch (error) {
      console.error('Erreur dans maladieService.update:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/maladies/${id}`);
    } catch (error) {
      console.error('Erreur dans maladieService.delete:', error);
      throw error;
    }
  }
};

// Export par défaut
export default maladieService;
import api from './api';
import { Commune, CommuneFormData } from '../types/commune';

const communeService = {
  async getAll(): Promise<Commune[]> {
    try {
      const response = await api.get('/communes');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement communes:', error);
      throw error;
    }
  },

  async getByWilaya(wilayaId: number): Promise<Commune[]> {
    try {
      const response = await api.get(`/communes/wilaya/${wilayaId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement communes par wilaya:', error);
      throw error;
    }
  },

  async create(commune: CommuneFormData): Promise<Commune> {
    try {
      const response = await api.post('/communes', commune);
      return response.data;
    } catch (error) {
      console.error('Erreur création commune:', error);
      throw error;
    }
  },

  async update(id: number, commune: CommuneFormData): Promise<Commune> {
    try {
      const response = await api.put(`/communes/${id}`, commune);
      return response.data;
    } catch (error) {
      console.error('Erreur modification commune:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/communes/${id}`);
    } catch (error) {
      console.error('Erreur suppression commune:', error);
      throw error;
    }
  }
};

export default communeService;
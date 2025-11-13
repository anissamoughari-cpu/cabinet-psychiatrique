import api from './api';
import { Wilaya, WilayaFormData } from '../types/wilaya';

const wilayaService = {
  async getAll(): Promise<Wilaya[]> {
    try {
      const response = await api.get('/wilayas');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement wilayas:', error);
      throw error;
    }
  },

  async create(wilaya: WilayaFormData): Promise<Wilaya> {
    try {
      const response = await api.post('/wilayas', wilaya);
      return response.data;
    } catch (error) {
      console.error('Erreur création wilaya:', error);
      throw error;
    }
  },

  async update(id: number, wilaya: WilayaFormData): Promise<Wilaya> {
    try {
      const response = await api.put(`/wilayas/${id}`, wilaya);
      return response.data;
    } catch (error) {
      console.error('Erreur modification wilaya:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/wilayas/${id}`);
    } catch (error) {
      console.error('Erreur suppression wilaya:', error);
      throw error;
    }
  }
};

export default wilayaService;
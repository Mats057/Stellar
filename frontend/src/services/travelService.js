import { api } from './apiClient';

export const travelService = {
  async getAllTravels(filters = {}) {
    const q = filters.search ? `?search=${encodeURIComponent(filters.search)}` : '';
    return api.get(`/travels${q}`);
  },

  async getTravelById(id) {
    return api.get(`/travels/${id}`);
  }
};

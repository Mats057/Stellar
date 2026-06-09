import { api } from './apiClient';

export const ticketService = {
  // pricePaid é ignorado de propósito: a API define o preço no servidor (segurança).
  async buyTicket(userId, travelId, pricePaid) {
    return api.post('/tickets', { user_id: userId, travel_id: travelId });
  },

  async getUserTickets(userId) {
    return api.get(`/users/${userId}/tickets`);
  }
};

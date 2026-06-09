import { api } from './apiClient';

// Mesma "interface" de antes (register/login) — só que agora chama a API real.
export const authService = {
  async register(name, email, password) {
    return api.post('/auth/register', { name, email, password });
  },

  async login(email, password) {
    return api.post('/auth/login', { email, password });
  }
};

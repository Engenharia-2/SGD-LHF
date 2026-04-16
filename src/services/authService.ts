import { API_URL, getHeaders } from './baseService';

export const authService = {
  /**
   * Realiza login no sistema.
   */
  async login(payload: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro no login');
    return data;
  },

  /**
   * Realiza cadastro no sistema.
   */
  async register(payload: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro no cadastro');
    return data;
  },

  /**
   * Altera a senha do usuário autenticado.
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao alterar senha');
    }

    return data;
  }
};

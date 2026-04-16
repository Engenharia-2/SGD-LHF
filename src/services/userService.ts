import { API_URL, getHeaders } from './baseService';
import type { User } from '../types';

export const userService = {
  /**
   * Lista todos os usuários (disponível para Administradores e Gestores).
   */
  async listAll(): Promise<User[]> {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao carregar usuários');
    return data.data;
  },

  /**
   * Autoriza um usuário pendente.
   */
  async authorize(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/users/${id}/authorize`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao autorizar');
    return data;
  },

  /**
   * Remove ou recusa um usuário.
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao remover');
    return data;
  },

  /**
   * Redefine a senha de um usuário.
   */
  async resetPassword(id: number, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/admin/users/${id}/reset-password`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao redefinir senha');
    return data;
  }
};

import type { Document } from '../types';
import { API_URL, getHeaders } from './baseService';

export const favoriteService = {
  async favorite(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/favorite`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao favoritar documento');
    }
  },

  async unfavorite(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/favorite`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao remover favorito');
    }
  },

  async list(): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents/favorites`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar favoritos');
    return data.data;
  },
};

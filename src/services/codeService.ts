import { API_URL, getHeaders } from './baseService';

export interface DocumentCode {
  id: number;
  prefix: string;
  description: string;
  created_at: string;
}

export const codeService = {
  async list(): Promise<DocumentCode[]> {
    const response = await fetch(`${API_URL}/document-codes`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar códigos');
    return data.data;
  },

  async create(prefix: string, description: string): Promise<void> {
    const response = await fetch(`${API_URL}/document-codes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prefix, description }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao criar código');
  },

  async update(id: number, prefix: string, description: string): Promise<void> {
    const response = await fetch(`${API_URL}/document-codes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ prefix, description }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao atualizar código');
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/document-codes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao excluir código');
    }
  }
};

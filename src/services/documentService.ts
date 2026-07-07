import type { Document } from '../types';
import { API_URL, getHeaders } from './baseService';

export const documentService = {
  async upload(formData: FormData): Promise<Document> {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao realizar upload do documento.');
    }

    return data.data;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao excluir documento.');
    }
  },

  async list(sector: string, category: string): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents?sector=${sector}&category=${category}`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar documentos');
    return data.data;
  },

  async update(_id: number, formData: FormData): Promise<void> {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao criar nova versão do documento.');
    }
  },

  async updateStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao atualizar status do documento.');
    }
  },

  /**
   * Lista documentos usando filtros genéricos (ex: categoria).
   */
  async listByFilters(filters: { category?: string, sector?: string }): Promise<Document[]> {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.sector) params.append('sector', filters.sector);

    const response = await fetch(`${API_URL}/documents?${params.toString()}`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar documentos filtrados');
    return data.data;
  },

  async listAllUsersGlobal(): Promise<any[]> {
    const response = await fetch(`${API_URL}/documents/users/global`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar usuários globais.');
    return data.data;
  },

  async getAvailableApprovers(): Promise<any[]> {
    const response = await fetch(`${API_URL}/documents/approvers`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar aprovadores disponíveis.');
    return data.data;
  },
  async getMyDraftsTracking(): Promise<any[]> {
    const response = await fetch(`${API_URL}/documents/my-drafts`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar rascunhos pendentes.');
    return data.data;
  },

  async remindApprovers(id: number): Promise<number> {
    const response = await fetch(`${API_URL}/documents/${id}/remind-approvers`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao enviar lembretes.');
    return data.data.notifiedCount;
  }
};

import type { Document } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('sgd_token');
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const documentService = {
  async upload(formData: FormData): Promise<Document> {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao realizar upload do documento.');
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao excluir documento.');
    }
  },

  async list(sector: string, category: string): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents?sector=${sector}&category=${category}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar documentos');
    return response.json();
  },

  async update(id: number, formData: FormData): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getHeaders(true), // true for multipart/form-data
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar documento.');
    }
  },

  async updateStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sgd_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar status do documento.');
    }
  },

  async favorite(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/favorite`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao favoritar documento');
  },

  async unfavorite(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/favorite`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao remover favorito');
  },

  async listFavorites(): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents/favorites`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar favoritos');
    return response.json();
  }
};

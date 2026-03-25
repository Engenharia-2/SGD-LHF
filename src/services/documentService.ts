import type { Document } from '../hooks/useDocuments';

const API_URL = 'http://localhost:3003';

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
  }
};

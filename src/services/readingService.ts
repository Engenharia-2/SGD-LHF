import { API_URL, getHeaders } from './baseService';

export const readingService = {
  /**
   * Marca um documento como lido pelo funcionário.
   */
  async markAsRead(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/read`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao marcar documento como lido.');
    }
  },

  /**
   * Lista leituras pendentes de confirmação (para Gestores).
   */
  async listPendingReadings(): Promise<any[]> {
    const response = await fetch(`${API_URL}/documents/pending-readings`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar leituras pendentes.');
    return data.data;
  },

  /**
   * Confirma a leitura de um documento.
   */
  async confirmReading(readingId: number): Promise<void> {
    const response = await fetch(`${API_URL}/documents/confirm-reading/${readingId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao confirmar leitura.');
    }
  },

  /**
   * Busca estatísticas de leitura (Lidos vs Faltantes).
   */
  async getReadingStats(id: number): Promise<{ read: any[], missing: any[] }> {
    const response = await fetch(`${API_URL}/documents/${id}/reading-stats`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar estatísticas de leitura.');
    return data.data;
  },

  /**
   * Lista documentos que o usuário logado ainda não leu.
   */
  async getMyPendingReadings(): Promise<any[]> {
    const response = await fetch(`${API_URL}/documents/my-pending-readings`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar minhas leituras pendentes.');
    return data.data;
  }
};

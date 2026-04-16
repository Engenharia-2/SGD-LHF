import { API_URL, getHeaders } from './baseService';

export const notificationService = {
  /**
   * Busca notificações do usuário.
   */
  async getNotifications(userId: number, sector: string): Promise<any> {
    const response = await fetch(`${API_URL}/notifications/${userId}/${sector}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao carregar notificações');
    return data;
  },

  /**
   * Marca uma notificação como lida.
   */
  async markAsRead(id: number, userId: number): Promise<any> {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao marcar como lida');
    return data;
  }
};

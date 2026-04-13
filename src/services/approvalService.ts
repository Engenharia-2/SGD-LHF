import type { Document } from '../types';
import { API_URL, getHeaders } from './baseService';

export const approvalService = {
  async listPendingApprovals(): Promise<Document[]> {
    const response = await fetch(`${API_URL}/documents/pending-approvals`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar aprovações pendentes');
    return data.data;
  },

  async handleApprovalAction(id: number, action: 'Aprovado' | 'Rejeitado', reason?: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}/approve-action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, reason }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao processar ação de aprovação');
    }
  },
};

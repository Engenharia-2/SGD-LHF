import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';
import type { DocumentDraftTracking } from '../types';

export const useMyDraftsTracking = () => {
  const [drafts, setDrafts] = useState<DocumentDraftTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<DocumentDraftTracking | null>(null);
  const [reminding, setReminding] = useState(false);

  const fetchDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentService.getMyDraftsTracking();
      setDrafts(data);
    } catch (err) {
      console.error('Erro ao buscar rascunhos em revisão:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleRemindApprovers = useCallback(async () => {
    if (!selectedDraft) return;
    setReminding(true);
    try {
      const notifiedCount = await documentService.remindApprovers(selectedDraft.id);
      alert(`${notifiedCount} lembretes foram enviados com sucesso!`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Erro ao enviar lembretes.');
      } else {
        alert('Erro desconhecido ao enviar lembretes.');
      }
    } finally {
      setReminding(false);
    }
  }, [selectedDraft]);

  return {
    drafts,
    loading,
    selectedDraft,
    reminding,
    setSelectedDraft,
    handleRemindApprovers
  };
};

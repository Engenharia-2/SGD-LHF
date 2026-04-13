import { useState, useEffect } from 'react';
import { readingService } from '../services/readingService';
import { useAlert } from '../contexts/AlertContext';
import type { User } from '../types';

interface ReadingStats {
  read: Array<{ id: number, username: string, status: string, confirmed_at: string | null }>;
  missing: Array<{ id: number, username: string }>;
}

export const useDocumentReading = (documentId: number, isPublished: boolean, user: User | null) => {
  const { showAlert } = useAlert();
  const [isMarking, setIsMarking] = useState(false);
  const [hasMarked, setHasMarked] = useState(false);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const isAdminOrManager = user?.role === 'Administrador' || user?.role === 'Gestor';

  const fetchStats = async () => {
    if (!isAdminOrManager || !isPublished) return;
    setLoadingStats(true);
    try {
      const data = await readingService.getReadingStats(documentId);
      setStats(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [documentId, isPublished, isAdminOrManager]);

  const handleMarkAsRead = async () => {
    if (!user) return;
    setIsMarking(true);
    try {
      await readingService.markAsRead(documentId);
      setHasMarked(true);
      showAlert('Leitura registrada! Aguarde a confirmação do gestor.', 'success');
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar leitura.';
      showAlert(errorMessage, 'error');
      return false;
    } finally {
      setIsMarking(false);
    }
  };

  return {
    stats,
    loadingStats,
    isMarking,
    hasMarked,
    handleMarkAsRead,
    isAdminOrManager
  };
};

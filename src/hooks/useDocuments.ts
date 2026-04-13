import { useState, useCallback } from 'react';
import { documentService } from '../services/documentService';
import { favoriteService } from '../services/favoriteService';
import type { Document } from '../types';

export const useDocuments = (sector: string, category: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!sector) return;
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.list(sector, category);
      setDocuments(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sector, category]);

  const addDocument = useCallback((newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]);
  }, []);

  const updateDocument = useCallback(async (id: number, formData: FormData) => {
    try {
      await documentService.update(id, formData);
      // Recarregamos para garantir que pegamos os novos dados do arquivo (size, mimetype etc)
      await fetchDocuments();
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar';
      setError(message);
      return false;
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: number) => {
    try {
      await documentService.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir';
      setError(message);
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await favoriteService.unfavorite(id);
      } else {
        await favoriteService.favorite(id);
      }
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, is_favorite: !currentStatus } : doc
      ));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao favoritar';
      setError(message);
      return false;
    }
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    toggleFavorite,
  };
};

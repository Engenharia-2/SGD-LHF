import { useState, useCallback } from 'react';
import { documentService } from '../services/documentService';

export interface Document {
  id: number;
  title: string;
  filename: string;
  original_name: string;
  mimetype: string;
  size: number;
  sector: string;
  category: string;
  responsible: string;
  version: string;
  status: 'Revisão' | 'Aprovado' | 'Obsoleto';
  creation_date: string;
  uploaded_at: string;
  parent_id?: number;
  history?: Partial<Document>[];
}

interface User {
  id: number;
  username: string;
  sector: string;
  role: string;
}

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

  const addDocument = (newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = async (id: number, formData: FormData) => {
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
  };

  const deleteDocument = async (id: number) => {
    try {
      await documentService.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir';
      setError(message);
      return false;
    }
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
  };
};

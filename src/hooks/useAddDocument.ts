import { useState } from 'react';
import { documentService } from '../services/documentService';
import type { Document } from '../types';

interface User {
  username: string;
  sector: string;
}

// Atualizado: Todas as categorias utilizadas no sistema
export type DocumentCategory = 
  | 'PROCESSOS' 
  | 'GESTAO' 
  | 'GERAL' 
  | 'ATAS' 
  | 'FORMULARIOS' 
  | 'NORMAS' 
  | 'RELATORIOS' 
  | 'TREINAMENTO';

export const useAddDocument = (_user: User, _category: DocumentCategory, onDocumentAdded?: (doc: Document) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const uploadWithData = async (formData: FormData) => {
    setError(null);
    setIsUploading(true);

    try {
      const newDoc = await documentService.upload(formData);
      if (onDocumentAdded) onDocumentAdded(newDoc);
      return newDoc;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no upload do documento';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    showModal,
    handleOpenModal,
    handleCloseModal,
    uploadWithData,
  };
};

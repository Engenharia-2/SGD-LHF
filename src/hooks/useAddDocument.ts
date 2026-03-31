import { useState, useRef } from 'react';
import { documentService } from '../services/documentService';
import type { Document } from '../types';

interface User {
  username: string;
  sector: string;
}

// Atualizado: Categorias sem siglas técnicas
export type DocumentCategory = 'PROCESSOS' | 'GESTAO' | 'GERAL';

export const useAddDocument = (user: User, category: DocumentCategory, onDocumentAdded?: (doc: Document) => void) => {
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
    } catch (err: any) {
      setError(err.message);
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

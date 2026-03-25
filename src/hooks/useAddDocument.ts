import { useState, useRef } from 'react';
import { documentService } from '../services/documentService';
import type { Document } from './useDocuments';

interface User {
  username: string;
  sector: string;
}

interface AddDocumentFormState {
  title: string;
  responsible: string;
  version: string;
  status: 'Revisão' | 'Aprovado' | 'Obsoleto';
  creationDate: string;
  selectedFile: File | null;
}

// Atualizado: Categorias sem siglas técnicas
export type DocumentCategory = 'PROCESSOS' | 'GESTAO' | 'GERAL';

export const useAddDocument = (user: User, category: DocumentCategory, onDocumentAdded?: (doc: Document) => void) => {
  const initialState: AddDocumentFormState = {
    title: '',
    responsible: user.username,
    version: '1.0',
    status: 'Revisão',
    creationDate: new Date().toISOString().split('T')[0],
    selectedFile: null,
  };

  const [formState, setFormState] = useState<AddDocumentFormState>(initialState);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof AddDocumentFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'xlsx', 'docx', 'doc', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setError('Formato de arquivo não suportado (PDF, DOCX, XLSX apenas)');
      setField('selectedFile', null);
      return;
    }

    setError(null);
    setField('selectedFile', file);
  };

  const resetForm = () => {
    setFormState(initialState);
    setError(null);
  };

  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const upload = async () => {
    if (!formState.selectedFile) {
      setError('Por favor, selecione um arquivo.');
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', formState.selectedFile);
    formData.append('title', formState.title || formState.selectedFile.name);
    formData.append('sector', user.sector);
    formData.append('category', category);
    formData.append('responsible', formState.responsible);
    formData.append('version', formState.version);
    formData.append('status', formState.status);
    formData.append('creation_date', formState.creationDate);

    try {
      const newDoc = await documentService.upload(formData);
      if (onDocumentAdded) onDocumentAdded(newDoc);
      handleCloseModal();
      return newDoc;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formState,
    setField,
    isUploading,
    error,
    showModal,
    fileInputRef,
    handleFileChange,
    handleOpenModal,
    handleCloseModal,
    upload,
  };
};

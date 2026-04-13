import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from './useDocuments';
import { useDocumentFilter } from './useDocumentFilter';
import type { Document } from '../types';

/**
 * Hook de orquestração para páginas de documentos (Processos, Normas, Atas, etc.)
 * Centraliza autenticação, busca, filtragem e ações de CRUD.
 */
export const useDocumentPageLogic = (category: string) => {
  const { user, activeSector, canModify } = useAuth();

  // Hook de API (CRUD)
  const { 
    documents, 
    fetchDocuments, 
    addDocument, 
    updateDocument,
    deleteDocument,
    toggleFavorite 
  } = useDocuments(activeSector, category);

  // Hook de Filtragem
  const { 
    filteredDocuments, 
    setActiveFilters, 
    hasActiveFilters 
  } = useDocumentFilter(documents);

  // Efeito de busca inicial e atualização por setor
  useEffect(() => {
    if (activeSector) {
      fetchDocuments();
    }
  }, [activeSector, fetchDocuments]);

  // Handler de adição de documento (Memoizado)
  const handleDocumentAdded = useCallback((newDoc: Document) => {
    addDocument(newDoc);
  }, [addDocument]);

  // Handler de filtragem (Memoizado) - Resolve a sua sugestão específica
  const handleFilter = useCallback((filters: any) => {
    setActiveFilters(filters);
  }, [setActiveFilters]);

  return {
    // Contexto
    user,
    activeSector,
    canModify,
    
    // Dados e Estado
    documents,
    filteredDocuments,
    hasActiveFilters,
    
    // Ações (CRUD e UI)
    handleDocumentAdded,
    handleFilter,
    updateDocument,
    deleteDocument,
    toggleFavorite
  };
};

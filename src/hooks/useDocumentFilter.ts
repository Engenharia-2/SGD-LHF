import { useState, useMemo } from 'react';
import type { Document } from './useDocuments';
import type { Filters } from '../components/Documents/DocumentFilter';

export const useDocumentFilter = (documents: Document[]) => {
  const [activeFilters, setActiveFilters] = useState<Filters>({
    title: '',
    responsible: '',
    date: '',
    version: '',
    status: ''
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filtragem por título (case-insensitive)
      const matchTitle = (doc.title || '').toLowerCase().includes(activeFilters.title.toLowerCase());
      
      // Filtragem por responsável (case-insensitive)
      const matchResponsible = (doc.responsible || '').toLowerCase().includes(activeFilters.responsible.toLowerCase());
      
      // Filtragem por versão (case-insensitive)
      const matchVersion = (doc.version || '').toLowerCase().includes(activeFilters.version.toLowerCase());
      
      // Filtragem por status (comparação exata ou todos)
      const matchStatus = activeFilters.status === '' || doc.status === activeFilters.status;
      
      // Filtragem por data (compara apenas a parte YYYY-MM-DD)
      const docDate = doc.creation_date ? doc.creation_date.split('T')[0] : '';
      const matchDate = activeFilters.date === '' || docDate === activeFilters.date;

      return matchTitle && matchResponsible && matchVersion && matchStatus && matchDate;
    });
  }, [documents, activeFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(value => value !== '');
  }, [activeFilters]);

  return {
    activeFilters,
    setActiveFilters,
    filteredDocuments,
    hasActiveFilters
  };
};

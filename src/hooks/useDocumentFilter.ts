import { useState, useMemo } from 'react';
import type { Document } from '../types';
import type { Filters } from '../components/Documents/DocumentFilter';

export const useDocumentFilter = (documents: Document[]) => {
  const [activeFilters, setActiveFilters] = useState<Filters>({
    doc_code: '',
    title: '',
    responsible: '',
    date: '',
    version: '',
    status: ''
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchCode = (doc.doc_code || '').toLowerCase().includes(activeFilters.doc_code.toLowerCase());

      const matchTitle = (doc.title || '').toLowerCase().includes(activeFilters.title.toLowerCase());
      
      const matchResponsible = (doc.responsible || '').toLowerCase().includes(activeFilters.responsible.toLowerCase());
      
      const matchVersion = (doc.version || '').toLowerCase().includes(activeFilters.version.toLowerCase());
      
      const matchStatus = activeFilters.status === '' || doc.status === activeFilters.status;
      
      const docDate = doc.creation_date ? doc.creation_date.split('T')[0] : '';
      const matchDate = activeFilters.date === '' || docDate === activeFilters.date;

      return matchCode && matchTitle && matchResponsible && matchVersion && matchStatus && matchDate;
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

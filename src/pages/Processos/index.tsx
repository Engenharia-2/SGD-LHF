import React, { useEffect } from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentFilter } from '../../hooks/useDocumentFilter';
import { useAuth } from '../../contexts/AuthContext';
import type { Document } from '../../types';
import './styles.css';

const Processos: React.FC = () => {
  const { user, activeSector, canModify } = useAuth();

  const { 
    documents, 
    fetchDocuments, 
    addDocument, 
    updateDocument,
    deleteDocument,
    toggleFavorite
  } = useDocuments(activeSector, 'PROCESSOS');

  // Utilizando o hook de filtragem abstraído
  const { 
    filteredDocuments, 
    setActiveFilters, 
    hasActiveFilters 
  } = useDocumentFilter(documents);

  useEffect(() => {
    if (activeSector) {
      fetchDocuments();
    }
  }, [activeSector, fetchDocuments]);

  const handleDocumentAdded = (newDoc: Document) => {
    addDocument(newDoc);
  };

  if (!user) return null;

  return (
    <div className="processos-container">
      <div className="page-header">
        <h2>Processos - {activeSector}</h2>
        {user.sector !== activeSector && (
          <span className="view-mode-badge">Modo Visualização: {activeSector}</span>
        )}
      </div>

      {canModify && (
        <AddDocument 
          user={user} 
          category="PROCESSOS" 
          onDocumentAdded={handleDocumentAdded} 
        />
      )}

      <DocumentFilter onFilter={setActiveFilters} />

      <DocumentList 
        documents={filteredDocuments}
        user={user}
        title={`Lista de Processos (${activeSector})`}
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum documento corresponde aos filtros aplicados."
            : `Nenhum processo encontrado para o setor ${activeSector}.`
        }
        onDelete={deleteDocument}
        onUpdate={updateDocument}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Processos;

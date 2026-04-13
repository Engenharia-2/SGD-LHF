import React from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocumentPageLogic } from '../../hooks/useDocumentPageLogic';
import './styles.css';

const Processos: React.FC = () => {
  const { 
    user, 
    activeSector, 
    canModify, 
    filteredDocuments, 
    hasActiveFilters,
    handleFilter, 
    handleDocumentAdded, 
    deleteDocument, 
    updateDocument, 
    toggleFavorite 
  } = useDocumentPageLogic('PROCESSOS');

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

      <DocumentFilter onFilter={handleFilter} />

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

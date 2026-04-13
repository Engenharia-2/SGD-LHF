import React from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocumentPageLogic } from '../../hooks/useDocumentPageLogic';
import './styles.css';

const Formularios: React.FC = () => {
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
  } = useDocumentPageLogic('FORMULARIOS');

  if (!user) return null;

  return (
    <div className="formularios-container">
      <div className="page-header">
        <h2>Formulários - {activeSector}</h2>
        {user.sector !== activeSector && (
          <span className="view-mode-badge">Modo Visualização: {activeSector}</span>
        )}
      </div>

      {canModify && (
        <AddDocument 
          user={user} 
          category="FORMULARIOS" 
          onDocumentAdded={handleDocumentAdded} 
        />
      )}

      <DocumentFilter onFilter={handleFilter} />

      <DocumentList 
        documents={filteredDocuments}
        user={user}
        title={`Lista de Formulários (${activeSector})`}
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum documento corresponde aos filtros aplicados."
            : `Nenhum formulário encontrado para o setor ${activeSector}.`
        }
        onDelete={deleteDocument}
        onUpdate={updateDocument}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Formularios;

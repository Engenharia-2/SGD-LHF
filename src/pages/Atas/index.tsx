import React from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocumentPageLogic } from '../../hooks/useDocumentPageLogic';
import './styles.css';

const Atas: React.FC = () => {
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
  } = useDocumentPageLogic('ATAS');

  if (!user) return null;

  return (
    <div className="atas-container">
      <div className="page-header">
        <h2>Atas - {activeSector}</h2>
        {user.sector !== activeSector && (
          <span className="view-mode-badge">Modo Visualização: {activeSector}</span>
        )}
      </div>

      {canModify && (
        <AddDocument 
          user={user} 
          category="ATAS" 
          onDocumentAdded={handleDocumentAdded} 
        />
      )}

      <DocumentFilter onFilter={handleFilter} />

      <DocumentList 
        documents={filteredDocuments}
        user={user}
        title={`Lista de Atas (${activeSector})`}
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum documento corresponde aos filtros aplicados."
            : `Nenhuma ata encontrada para o setor ${activeSector}.`
        }
        onDelete={deleteDocument}
        onUpdate={updateDocument}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Atas;

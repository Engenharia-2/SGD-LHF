import React from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocumentPageLogic } from '../../hooks/useDocumentPageLogic';
import './styles.css';

const Treinamento: React.FC = () => {
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
  } = useDocumentPageLogic('TREINAMENTO');

  if (!user) return null;

  return (
    <div className="treinamento-container">
      <div className="page-header">
        <h2>Treinamento - {activeSector}</h2>
        {user.sector !== activeSector && (
          <span className="view-mode-badge">Modo Visualização: {activeSector}</span>
        )}
      </div>

      {canModify && (
        <AddDocument 
          user={user} 
          category="TREINAMENTO" 
          onDocumentAdded={handleDocumentAdded} 
        />
      )}

      <DocumentFilter onFilter={handleFilter} />

      <DocumentList 
        documents={filteredDocuments}
        user={user}
        title={`Lista de Treinamentos (${activeSector})`}
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum documento corresponde aos filtros aplicados."
            : `Nenhum treinamento encontrado para o setor ${activeSector}.`
        }
        onDelete={deleteDocument}
        onUpdate={updateDocument}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Treinamento;

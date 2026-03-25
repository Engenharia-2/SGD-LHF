import React, { useState, useEffect } from 'react';
import AddDocument from '../../components/Documents/AddDocument';
import DocumentList from '../../components/Documents/DocumentList';
import DocumentFilter from '../../components/Documents/DocumentFilter';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentFilter } from '../../hooks/useDocumentFilter';
import type { Document } from '../../hooks/useDocuments';
import './styles.css';

interface User {
  id: number;
  username: string;
  sector: string;
  role: string;
}

const Gestao: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sgd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { 
    documents, 
    fetchDocuments, 
    addDocument, 
    updateDocument,
    deleteDocument 
  } = useDocuments(user, 'GESTAO');

  // Utilizando o hook de filtragem abstraído
  const { 
    filteredDocuments, 
    setActiveFilters, 
    hasActiveFilters 
  } = useDocumentFilter(documents);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, fetchDocuments]);

  const handleDocumentAdded = (newDoc: Document) => {
    addDocument(newDoc);
  };

  if (!user) return null;

  return (
    <div className="gestao-container">
      <h2>Gestão</h2>

      <AddDocument 
        user={user} 
        category="GESTAO" 
        onDocumentAdded={handleDocumentAdded} 
      />

      <DocumentFilter onFilter={setActiveFilters} />

      <DocumentList 
        documents={filteredDocuments}
        user={user}
        title="Lista de Gestão" 
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum documento corresponde aos filtros aplicados."
            : `Nenhum documento de gestão encontrado para o setor ${user.sector}.`
        }
        onDelete={deleteDocument}
        onUpdate={updateDocument}
      />
    </div>
  );
};

export default Gestao;

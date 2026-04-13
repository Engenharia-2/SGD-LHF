import React, { useState, useCallback } from 'react';
import './styles.css';
import type { Document } from '../../../types';
import { X } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import ConfirmModal from '../../Layout/ConfirmModal';
import DocumentItem from '../DocumentItem';
import DocumentModal from '../DocumentModal';
import DocumentForm from '../DocumentForm';

interface DocumentListProps {
  documents: Document[];
  user: {
    id: number;
    username: string;
    sector: string;
    role: string;
  };
  title?: string;
  emptyMessage?: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, formData: FormData) => Promise<boolean>;
  onToggleFavorite?: (id: number, currentStatus: boolean) => void;
  compact?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents,
  user,
  title = "Lista de Documentos", 
  emptyMessage = "Nenhum documento encontrado.",
  onDelete,
  onUpdate,
  onToggleFavorite,
}) => {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    showAlert,
  } = useAlert();

  const canModify = user.role === 'Administrador' || user.role === 'Gestor';

  const handleView = useCallback((document: Document) => {
    setViewingDoc(document);
  }, []);

  const handleEdit = useCallback((document: Document) => {
    setEditingDoc(document);
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    setDocToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (docToDelete && onDelete) {
      onDelete(docToDelete);
      showAlert("Documento e todas as suas versões excluídos.", "success");
      setDocToDelete(null);
    }
  }, [docToDelete, onDelete, showAlert]);

  const handleUpdateSubmit = useCallback(async (formData: FormData) => {
    if (editingDoc && onUpdate) {
      setIsUpdating(true);
      try {
        const success = await onUpdate(editingDoc.id, formData);
        if (success) {
          showAlert('Nova versão enviada para aprovação!', 'success');
          setEditingDoc(null);
        } else {
          showAlert('Erro ao criar nova versão.', 'error');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar nova versão.';
        showAlert(errorMessage, 'error');
      } finally {
        setIsUpdating(false);
      }
    }
  }, [editingDoc, onUpdate, showAlert]);

  return (
    <div className="document-list-container">
      <h3>{title}</h3>
      {documents.length === 0 ? (
        <div className="placeholder-content">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="document-list">
          {documents.map(doc => (
            <DocumentItem 
              key={doc.id}
              doc={doc}
              canModify={canModify}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </ul>
      )}

      {/* Modal de Detalhes (Visualização) */}
      {viewingDoc && (
        <DocumentModal 
          document={viewingDoc} 
          onClose={() => setViewingDoc(null)} 
        />
      )}

      {/* Modal de Edição (Nova Versão) */}
      {editingDoc && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3>Criar Nova Versão - {editingDoc.title}</h3>
              <button className="btn-close" onClick={() => setEditingDoc(null)}>
                <X size={24} />
              </button>
            </div>
            <DocumentForm 
              initialData={editingDoc}
              user={user}
              category={editingDoc.category}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditingDoc(null)}
              isUploading={isUpdating}
            />
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={docToDelete !== null}
        title="Excluir Documento"
        message="Tem certeza que deseja excluir este documento permanentemente?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocToDelete(null)}
        confirmText="Excluir"
      />
    </div>
  );
};

export default DocumentList;

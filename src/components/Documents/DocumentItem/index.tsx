import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Star } from 'lucide-react';
import type { Document } from '../../../types';
import { documentService } from '../../../services/documentService';
import { useAlert } from '../../../contexts/AlertContext';
import './styles.css';

interface DocumentItemProps {
  doc: Document;
  canModify: boolean;
  onView: (filename: string) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: number) => void;
  onToggleFavorite?: (id: number, currentStatus: boolean) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ 
  doc, 
  canModify, 
  onView, 
  onEdit, 
  onDelete,
  onToggleFavorite
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState(doc.id);
  const [currentStatus, setCurrentStatus] = useState(doc.status || 'Revisão');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { showAlert } = useAlert();
  
  // Encontrar os dados da versão selecionada no histórico
  const currentView = doc.history?.find(v => v.id === selectedVersionId) || doc;

  const handleStatusChange = async (newStatus: string) => {
    if (!canModify) return;
    
    setIsUpdatingStatus(true);
    try {
      await documentService.updateStatus(doc.id, newStatus);
      setCurrentStatus(newStatus as 'Revisão' | 'Aprovado' | 'Obsoleto');
      showAlert('Status atualizado com sucesso!', 'success');
    } catch (err: any) {
      showAlert(err.message, 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <li className="document-item">
      <div className="doc-favorite">
        <button 
          className={`btn-icon btn-favorite ${doc.is_favorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite?.(doc.id, !!doc.is_favorite)}
          title={doc.is_favorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        >
          <Star size={20} fill={doc.is_favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="doc-info">
        <div className="doc-title-row">
          <span className="doc-title">{currentView.title}</span>
          
          {canModify && selectedVersionId === doc.id ? (
            <div className="status-selector-wrapper">
              <select 
                className={`doc-status-select status-${currentStatus.toLowerCase()}`}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                title="Alterar Status do Documento"
              >
                <option value="Aprovado">Aprovado</option>
                <option value="Obsoleto">Obsoleto</option>
              </select>
            </div>
          ) : (
            <span className={`doc-status status-${(selectedVersionId === doc.id ? currentStatus : currentView.status || 'revisão').toLowerCase()}`}>
              {selectedVersionId === doc.id ? currentStatus : currentView.status}
            </span>
          )}
          
          {doc.history && doc.history.length > 1 && (
            <div className="version-selector">
              <select 
                value={selectedVersionId} 
                onChange={(e) => setSelectedVersionId(Number(e.target.value))}
                title="Histórico de Versões"
              >
                {doc.history.map(v => (
                  <option key={v.id} value={v.id}>
                    v{v.version} {v.id === doc.id ? '(Atual)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <span className="doc-meta">
          v{currentView.version} | Responsável: {currentView.responsible} | {new Date(currentView.creation_date || currentView.uploaded_at || '').toLocaleDateString()}
        </span>
        <span className="doc-sub-meta">
          {currentView.original_name} | {((currentView.size || 0) / 1024).toFixed(2)} KB
          {selectedVersionId !== doc.id && <strong className="old-version-warning">* Visualizando versão antiga</strong>}
        </span>
      </div>
      <div className="doc-actions">
        <button 
          className="btn-icon btn-view" 
          onClick={() => onView(currentView.filename || '')}
          title="Visualizar Versão Selecionada"
        >
          <Eye size={18} />
        </button>
        
        {canModify && (
          <>
            <button 
              className="btn-icon btn-edit" 
              onClick={() => onEdit(doc)} // Sempre edita a partir da base mais recente
              title="Criar Nova Versão"
            >
              <Pencil size={18} />
            </button>
            <button 
              className="btn-icon btn-delete" 
              onClick={() => onDelete(doc.id)}
              title="Excluir Documento (Tudo)"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default DocumentItem;

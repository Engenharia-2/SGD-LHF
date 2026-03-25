import React, { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Document } from '../../../hooks/useDocuments';
import './styles.css';

interface DocumentItemProps {
  doc: Document;
  canModify: boolean;
  onView: (filename: string) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: number) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ 
  doc, 
  canModify, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState(doc.id);
  
  // Encontrar os dados da versão selecionada no histórico
  const currentView = doc.history?.find(v => v.id === selectedVersionId) || doc;

  return (
    <li className="document-item">
      <div className="doc-info">
        <div className="doc-title-row">
          <span className="doc-title">{currentView.title}</span>
          <span className={`doc-status status-${currentView.status?.toLowerCase()}`}>
            {currentView.status}
          </span>
          
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

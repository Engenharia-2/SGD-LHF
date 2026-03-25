import React, { useState } from 'react';
import './styles.css';
import type { Document } from '../../../hooks/useDocuments';
import { X } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import Notification from '../../Layout/Notification';
import ConfirmModal from '../../Layout/ConfirmModal';
import DocumentItem from '../DocumentItem';

interface DocumentListProps {
  documents: Document[];
  user: {
    role: string;
  };
  title?: string;
  emptyMessage?: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, formData: FormData) => Promise<boolean>;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents,
  user,
  title = "Lista de Documentos", 
  emptyMessage = "Nenhum documento encontrado.",
  onDelete,
  onUpdate
}) => {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editForm, setEditForm] = useState<Partial<Document>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);

  const {
    notification,
    showNotification,
    hideNotification
  } = useNotification();

  const canModify = user.role === 'Administrador' || user.role === 'Gestor';

  const handleView = (filename: string) => {
    if (!filename) {
      showNotification("Erro: Nome do arquivo não encontrado.", "error");
      return;
    }
    const fileUrl = `http://localhost:3003/uploads/${filename}`;
    window.open(fileUrl, '_blank');
  };

  const handleConfirmDelete = () => {
    if (docToDelete && onDelete) {
      onDelete(docToDelete);
      showNotification("Documento e todas as suas versões excluídos.", "success");
      setDocToDelete(null);
    }
  };

  const handleEditClick = (doc: Document) => {
    setEditingDoc(doc);
    setSelectedFile(null);
    setEditForm({
      title: doc.title,
      responsible: doc.responsible,
      version: doc.version,
      status: doc.status,
      creation_date: doc.creation_date ? doc.creation_date.split('T')[0] : ''
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc && onUpdate) {
      const formData = new FormData();
      formData.append('title', editForm.title || '');
      formData.append('responsible', editForm.responsible || '');
      formData.append('version', editForm.version || '');
      formData.append('status', editForm.status || 'Revisão');
      formData.append('creation_date', editForm.creation_date || '');
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const success = await onUpdate(editingDoc.id, formData);
      if (success) {
        showNotification('Nova versão criada com sucesso!', 'success');
        setEditingDoc(null);
      } else {
        showNotification('Erro ao criar nova versão.', 'error');
      }
    }
  };

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
              onEdit={handleEditClick}
              onDelete={(id) => setDocToDelete(id)}
            />
          ))}
        </ul>
      )}

      {editingDoc && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Documento</h3>
              <button className="btn-close" onClick={() => setEditingDoc(null)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="edit-document-form">
              <div className="form-group">
                <label>Título</label>
                <input 
                  type="text" 
                  value={editForm.title || ''} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Responsável</label>
                  <input 
                    type="text" 
                    value={editForm.responsible || ''} 
                    onChange={e => setEditForm({...editForm, responsible: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Data</label>
                  <input 
                    type="date" 
                    value={editForm.creation_date || ''} 
                    onChange={e => setEditForm({...editForm, creation_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Versão</label>
                  <input 
                    type="text" 
                    value={editForm.version || ''} 
                    onChange={e => setEditForm({...editForm, version: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={editForm.status || 'Revisão'} 
                    onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                  >
                    <option value="Revisão">Revisão</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Obsoleto">Obsoleto</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Substituir Arquivo (Opcional)</label>
                <div className="file-upload-group">
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id="edit-file" 
                      onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                      hidden
                    />
                    <button 
                      type="button" 
                      className="btn-select-file"
                      onClick={() => document.getElementById('edit-file')?.click()}
                    >
                      Selecionar Novo Arquivo
                    </button>
                    <span className="selected-filename">
                      {selectedFile ? selectedFile.name : 'Nenhum arquivo novo selecionado'}
                    </span>
                  </div>
                  <p className="file-hint">Mantenha vazio para conservar o arquivo atual: {editingDoc.original_name}</p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingDoc(null)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Alterações</button>
              </div>
            </form>
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

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
    </div>
  );
};

export default DocumentList;

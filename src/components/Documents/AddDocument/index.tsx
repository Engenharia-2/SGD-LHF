import React from 'react';
import './styles.css';
import type { Document } from '../../../types';
import { useAddDocument } from '../../../hooks/useAddDocument';
import type { DocumentCategory } from '../../../hooks/useAddDocument';
import { useAlert } from '../../../contexts/AlertContext';

interface AddDocumentProps {
  onDocumentAdded?: (newDoc: Document) => void;
  user: {
    id: number;
    username: string;
    sector: string;
    role: string;
  };
  category: DocumentCategory;
}

const AddDocument: React.FC<AddDocumentProps> = ({ onDocumentAdded, user, category }) => {
  const {
    showAlert,
  } = useAlert();

  const {
    formState,
    setField,
    isUploading,
    error,
    showModal,
    fileInputRef,
    handleFileChange,
    handleOpenModal,
    handleCloseModal,
    upload,
  } = useAddDocument(user, category, onDocumentAdded);

  const canAdd = user.role === 'Administrador' || user.role === 'Gestor';

  if (!canAdd) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upload();
      showAlert('Documento adicionado com sucesso!', 'success');
    } catch (err) {
      showAlert('Erro ao adicionar documento.', 'error');
    }
  };


  // Nome amigável para exibição
  const displayCategory = category.charAt(0) + category.slice(1).toLowerCase();

  return (
    <div className="add-document-wrapper">
      <button className="btn-open-add-modal" onClick={handleOpenModal}>
        <span className="icon">+</span> Adicionar {displayCategory}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Registro - {displayCategory}</h3>
              <button className="btn-close" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="add-document-form">
              {error && <p className="upload-error">{error}</p>}

              <div className="form-group">
                <label>Título do Documento</label>
                <input 
                  type="text" 
                  placeholder="Ex: Instrução de Trabalho" 
                  value={formState.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Responsável</label>
                  <input 
                    type="text" 
                    value={formState.responsible}
                    onChange={(e) => setField('responsible', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data de Criação</label>
                  <input 
                    type="date" 
                    value={formState.creationDate}
                    onChange={(e) => setField('creationDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Versão</label>
                  <input 
                    type="text" 
                    placeholder="1.0" 
                    value={formState.version}
                    onChange={(e) => setField('version', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formState.status}
                    onChange={(e) => setField('status', e.target.value)}
                  >
                    <option value="Revisão">Revisão</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Obsoleto">Obsoleto</option>
                  </select>
                </div>
              </div>

              <div className="form-group file-upload-group">
                <label>Documento (Arquivo)</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,.docx,.doc,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <button 
                    type="button"
                    className="btn-select-file"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formState.selectedFile ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
                  </button>
                  {formState.selectedFile && (
                    <span className="selected-filename">{formState.selectedFile.name}</span>
                  )}
                </div>
                <p className="file-hint">Formatos aceitos: PDF, DOCX, XLSX</p>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={handleCloseModal}
                  disabled={isUploading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`btn-save ${isUploading ? 'loading' : ''}`}
                  disabled={isUploading || !formState.selectedFile}
                >
                  {isUploading ? 'Enviando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDocument;

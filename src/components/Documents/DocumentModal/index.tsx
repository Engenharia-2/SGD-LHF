import React from 'react';
import { X, FileText, Calendar, User, Tag, Layers, Info } from 'lucide-react';
import type { Document } from '../../../types';
import './styles.css';

interface DocumentModalProps {
  document: Document;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="document-modal-overlay" onClick={onClose}>
      <div className="document-modal-content" onClick={e => e.stopPropagation()}>
        <header className="document-modal-header">
          <div className="header-title">
            <FileText size={24} className="header-icon" />
            <h3>Detalhes do Registro</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <main className="document-modal-body">
          <section className="info-grid">
            <div className="info-item">
              <label><Tag size={16} /> Código</label>
              <span className="doc-code-badge">{document.doc_code || 'S/C'}</span>
            </div>

            <div className="info-item">
              <label><Tag size={16} /> Categoria</label>
              <span>{document.category}</span>
            </div>

            <div className="info-item full-width">
              <label><Info size={16} /> Título</label>
              <span className="modal-doc-title">{document.title}</span>
            </div>

            <div className="info-item full-width">
              <label><FileText size={16} /> Descrição</label>
              <p className="modal-doc-description">{document.description || 'Nenhuma descrição fornecida.'}</p>
            </div>

            <div className="info-item">
              <label><Layers size={16} /> Versão</label>
              <span className="version-badge">v{document.version}</span>
            </div>

            <div className="info-item">
              <label><User size={16} /> Responsável</label>
              <span>{document.responsible || 'Não informado'}</span>
            </div>

            <div className="info-item">
              <label><ShieldCheck size={16} /> Status</label>
              <span className={`status-badge ${document.status.toLowerCase()}`}>
                {document.status}
              </span>
            </div>

            <div className="info-item">
              <label><Calendar size={16} /> Data de Criação</label>
              <span>{formatDate(document.creation_date)}</span>
            </div>
          </section>

          <section className="document-files-section">
            <h4><Layers size={18} /> Arquivos do Registro</h4>
            <div className="files-list-container">
              {document.files && document.files.length > 0 ? (
                document.files.map((file) => (
                  <div key={file.id} className="file-item-preview">
                    <FileText size={20} className="file-icon" />
                    <div className="file-info-preview">
                      <span className="file-name" title={file.original_name}>{file.original_name}</span>
                      <span className="file-size">{formatSize(file.size)}</span>
                    </div>
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/uploads/${file.filename}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-file"
                    >
                      Visualizar
                    </a>
                  </div>
                ))
              ) : (
                <div className="single-file-preview">
                  <FileText size={20} />
                  <span>{document.original_name || 'Nenhum arquivo disponível'}</span>
                  {document.filename && (
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/uploads/${document.filename}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-download-preview"
                    >
                      Visualizar
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="document-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

import { ShieldCheck } from 'lucide-react';
export default DocumentModal;

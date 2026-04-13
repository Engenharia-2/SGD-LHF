import React from 'react';
import { Tag, Info, Layers, User, ShieldCheck, Calendar } from 'lucide-react';
import type { Document } from '../../../types';
import { formatDate } from '../../../utils/formatters';

interface DocumentInfoProps {
  document: Document;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({ document }) => {
  return (
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
  );
};

// Precisamos do ícone FileText que faltou importar corretamente
import { FileText } from 'lucide-react';

export default DocumentInfo;

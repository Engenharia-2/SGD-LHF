import React from 'react';
import { FileText, Calendar, Layers, CheckCircle } from 'lucide-react';
import type { Document } from '../../../types';
import './styles.css';

interface MyReadingCardProps {
  doc: Document;
  onMarkAsRead: (id: number) => void;
  onView: (doc: Document) => void;
}

const MyReadingCard: React.FC<MyReadingCardProps> = ({ doc, onMarkAsRead, onView }) => {
  return (
    <div className="my-pending-item" onClick={() => onView(doc)}>
      <div className="my-pending-info">
        <div className="my-pending-title-row">
          <div className="my-pending-doc-main">
            <FileText size={18} className="icon-primary" />
            <h4>
              {doc.doc_code && <span className="my-pending-doc-code">[{doc.doc_code}] </span>}
              {doc.title}
            </h4>
          </div>
          <span className="my-pending-tag">Leitura Pendente</span>
        </div>
        
        <div className="my-pending-details">
          <div className="detail-item">
            <Layers size={14} />
            <span>Setor: <strong>{doc.sector}</strong> | Versão: <strong>{doc.version}</strong></span>
          </div>
          <div className="detail-item">
            <Calendar size={14} />
            <span>Publicado em: {new Date(doc.uploaded_at || doc.creation_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="my-pending-actions" onClick={e => e.stopPropagation()}>
        <button 
          className="btn-mark-read" 
          onClick={() => onMarkAsRead(doc.id)}
          title="Marcar como Lido"
        >
          <CheckCircle size={18} />
          <span>Marcar como Lido</span>
        </button>
      </div>
    </div>
  );
};

export default MyReadingCard;

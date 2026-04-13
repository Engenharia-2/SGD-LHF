import React from 'react';
import { X, FileText, CheckCircle, Clock } from 'lucide-react';
import type { Document } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useDocumentReading } from '../../../hooks/useDocumentReading';

import DocumentInfo from './DocumentInfo';
import DocumentFiles from './DocumentFiles';
import ComplianceSection from './ComplianceSection';
import './styles.css';

interface DocumentModalProps {
  document: Document;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const { user } = useAuth();
  
  const {
    stats,
    loadingStats,
    isMarking,
    hasMarked,
    handleMarkAsRead,
    isAdminOrManager
  } = useDocumentReading(document.id, !!document.is_published, user);

  const showReadingAction = !!document.is_published && user?.role === 'Funcionario';
  const alreadyRead = !!document.user_reading_status || hasMarked;
  const isConfirmed = document.user_reading_status === 'Confirmado';

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
          <DocumentInfo document={document} />
          
          <DocumentFiles document={document} />

          {isAdminOrManager && !!document.is_published && (
            <ComplianceSection stats={stats} loading={loadingStats} />
          )}
        </main>

        <footer className="document-modal-footer">
          <div className="footer-actions-left">
            {showReadingAction && (
              alreadyRead ? (
                <div className={`reading-status-message ${isConfirmed ? 'confirmed' : ''}`}>
                  {isConfirmed ? <CheckCircle size={18} /> : <Clock size={18} />}
                  <span>
                    {isConfirmed 
                      ? 'Leitura realizada e confirmada pelo gestor.' 
                      : 'Leitura registrada. Aguardando validação do gestor.'}
                  </span>
                </div>
              ) : (
                <button 
                  className="btn-mark-read-modal" 
                  onClick={handleMarkAsRead}
                  disabled={isMarking}
                >
                  <CheckCircle size={18} />
                  {isMarking ? 'Registrando...' : 'Li e compreendo este documento'}
                </button>
              )
            )}
          </div>
          <button className="btn-secondary" onClick={onClose}>Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default DocumentModal;

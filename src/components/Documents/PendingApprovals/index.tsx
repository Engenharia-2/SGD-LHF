import React, { useEffect, useState } from 'react';
import { Check, X, MessageSquare, User, FileText, Calendar, Layers } from 'lucide-react';
import { approvalService } from '../../../services/approvalService';
import { useAlert } from '../../../contexts/AlertContext';
import type { Document } from '../../../types';
import DocumentModal from '../DocumentModal';
import './styles.css';

const PendingApprovals: React.FC = () => {
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const { showAlert } = useAlert();

  const fetchPending = async () => {
    try {
      const data = await approvalService.listPendingApprovals();
      setPendingDocs(data);
    } catch (err) {
      console.error('Erro ao buscar aprovações pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
  };

  const handleAction = async (id: number, action: 'Aprovado' | 'Rejeitado') => {
    if (action === 'Rejeitado' && !rejectionReason.trim()) {
      showAlert('Por favor, informe o motivo da rejeição.', 'error');
      return;
    }

    try {
      await approvalService.handleApprovalAction(id, action, rejectionReason);
      showAlert(`Documento ${action === 'Aprovado' ? 'aprovado' : 'rejeitado'} com sucesso!`, 'success');
      setRejectionId(null);
      setRejectionReason('');
      fetchPending();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar ação.';
      showAlert(errorMessage, 'error');
    }
  };

  if (loading) return null;
  if (pendingDocs.length === 0) return null;

  return (
    <div className="pending-approvals-container">
      <h3 className="pending-approvals-title">
        Aprovações Pendentes
        <span className="badge">{pendingDocs.length}</span>
      </h3>
      
      <div className="pending-list">
        {pendingDocs.map(doc => (
          <div key={doc.id} className="pending-item-wrapper">
            <div className="pending-item" onClick={() => handleView(doc)}>
              <div className="pending-info">
                <div className="pending-title-row">
                  <div className="pending-doc-main">
                    <FileText size={18} className="icon-primary" />
                    <h4>
                      {doc.doc_code && <span className="pending-doc-code">[{doc.doc_code}] </span>}
                      {doc.title}
                    </h4>
                  </div>
                  {/* <span className="pending-tag">Aguardando sua revisão</span> */}
                </div>
                
                <div className="pending-details-grid">
                  <div className="detail-item">
                    <Layers size={14} />
                    <span>Setor: <strong>{doc.sector}</strong> | Versão: <strong>{doc.version}</strong></span>
                  </div>
                  <div className="detail-item">
                    <User size={14} />
                    <span>Responsável: <strong>{doc.responsible}</strong></span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span className="pending-date">Criado em: {new Date(doc.creation_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="pending-actions" onClick={e => e.stopPropagation()}>
                <button 
                  className="btn-icon btn-approve-icon" 
                  onClick={() => handleAction(doc.id, 'Aprovado')}
                  title="Aprovar Documento"
                >
                  <Check size={20} />
                </button>
                <button 
                  className="btn-icon btn-reject-icon" 
                  onClick={() => setRejectionId(doc.id)}
                  title="Rejeitar Documento"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {rejectionId === doc.id && (
              <div className="rejection-form">
                <div className="rejection-form-header">
                  <MessageSquare size={16} />
                  <span>Justificativa da Rejeição</span>
                </div>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explique detalhadamente o motivo da rejeição para o autor..."
                  autoFocus
                />
                <div className="rejection-form-actions">
                  <button className="btn-cancel" onClick={() => {
                    setRejectionId(null);
                    setRejectionReason('');
                  }}>
                    Cancelar
                  </button>
                  <button 
                    className="btn-confirm-rejection" 
                    onClick={() => handleAction(doc.id, 'Rejeitado')}
                  >
                    Confirmar Rejeição
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDoc && (
        <DocumentModal 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </div>
  );
};

export default PendingApprovals;


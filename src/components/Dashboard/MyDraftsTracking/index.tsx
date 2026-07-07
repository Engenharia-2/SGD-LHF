import React from 'react';
import { FileText, CheckCircle, Clock, XCircle, X, Bell } from 'lucide-react';
import { useMyDraftsTracking } from '../../../hooks/useMyDraftsTracking';
import './styles.css';

const MyDraftsTracking: React.FC = () => {
  const {
    drafts,
    loading,
    selectedDraft,
    reminding,
    setSelectedDraft,
    handleRemindApprovers
  } = useMyDraftsTracking();

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircle size={18} className="icon-aprovado" />;
      case 'Rejeitado':
        return <XCircle size={18} className="icon-rejeitado" />;
      case 'Pendente':
      default:
        return <Clock size={18} className="icon-pendente" />;
    }
  };

  if (loading) {
    return <div className="my-drafts-container">Carregando seus documentos em revisão...</div>;
  }

  if (drafts.length === 0) {
    return null; // Oculta a sessão se não houver documentos em revisão
  }

  return (
    <div className="my-drafts-container">
      <div className="my-drafts-header">
        <FileText size={24} />
        <h3>Meus Documentos em Aprovação</h3>
      </div>

      <div className="drafts-grid">
        {drafts.map(draft => {
          const totalApprovers = draft.approvers.length;
          const approvedCount = draft.approvers.filter(a => a.status === 'Aprovado').length;
          const progressPercent = totalApprovers === 0 ? 0 : (approvedCount / totalApprovers) * 100;

          return (
            <div 
              key={draft.id} 
              className="draft-card"
              onClick={() => setSelectedDraft(draft)}
            >
              <div className="draft-status-badge">{draft.status}</div>
              <h4 className="draft-title" title={draft.title}>
                {draft.doc_code ? `[${draft.doc_code}] ` : ''}{draft.title}
              </h4>
              <div className="progress-container">
                <div className="progress-text">
                  <span>Progresso</span>
                  <span>{approvedCount} / {totalApprovers} Aprovados</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDraft && (
        <div className="modal-overlay" onClick={() => setSelectedDraft(null)}>
          <div className="draft-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes da Aprovação</h3>
              <button className="close-btn" onClick={() => setSelectedDraft(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <h4 className="draft-title" style={{ marginBottom: '0.5rem' }}>
                {selectedDraft.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Verifique o status individual de cada responsável pela aprovação deste documento.
              </p>

              <div className="approver-list">
                {selectedDraft.approvers.map(approver => (
                  <div key={approver.id} className="approver-item">
                    <div className="approver-info">
                      <span className="approver-name">{approver.username}</span>
                      <span className="approver-sector">{approver.sector}</span>
                    </div>
                    <div className="approver-status">
                      {approver.status}
                      {renderStatusIcon(approver.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="remind-btn" 
                onClick={handleRemindApprovers}
                disabled={reminding || !selectedDraft.approvers.some(a => a.status === 'Pendente')}
              >
                <Bell size={18} />
                {reminding ? 'Enviando...' : 'Notificar Pendentes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDraftsTracking;

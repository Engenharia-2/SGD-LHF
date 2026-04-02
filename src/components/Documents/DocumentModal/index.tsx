import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Tag, Layers, Info, ShieldCheck, CheckCircle, Clock, Users, AlertCircle } from 'lucide-react';
import type { Document } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../contexts/AlertContext';
import { documentService } from '../../../services/documentService';
import './styles.css';

interface DocumentModalProps {
  document: Document;
  onClose: () => void;
}

interface ReadingStats {
  read: Array<{ id: number, username: string, status: string, confirmed_at: string | null }>;
  missing: Array<{ id: number, username: string }>;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isMarking, setIsMarking] = useState(false);
  const [hasMarked, setHasMarked] = useState(false);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const isAdminOrManager = user?.role === 'Administrador' || user?.role === 'Gestor';

  useEffect(() => {
    if (isAdminOrManager && document.is_published) {
      fetchStats();
    }
  }, [document.id, isAdminOrManager]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await documentService.getReadingStats(document.id);
      setStats(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  };

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

  const handleMarkAsRead = async () => {
    if (!user) return;
    setIsMarking(true);
    try {
      await documentService.markAsRead(document.id);
      setHasMarked(true);
      showAlert('Leitura registrada! Aguarde a confirmação do gestor.', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar leitura.';
      showAlert(errorMessage, 'error');
    } finally {
      setIsMarking(false);
    }
  };

  const showReadingAction = document.is_published && user?.role === 'Funcionario';

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

          {/* Seção de Arquivos */}
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

          {/* Seção de Conformidade (Apenas para Gestores/Admins) */}
          {isAdminOrManager && document.is_published && (
            <section className="compliance-section">
              <div className="compliance-header">
                <h4><Users size={18} /> Controle de Conformidade (Leitura)</h4>
                {loadingStats && <span className="loading-small">Atualizando...</span>}
              </div>
              
              <div className="compliance-grid">
                <div className="compliance-column">
                  <h5 className="list-title text-success"><CheckCircle size={14} /> Lidos e Confirmados</h5>
                  <ul className="user-status-list">
                    {stats?.read.map(r => (
                      <li key={r.id} className={r.status === 'Confirmado' ? 'status-ok' : 'status-pending'}>
                        <span className="username">{r.username}</span>
                        <span className="status-label">{r.status === 'Confirmado' ? 'OK' : 'Pendente'}</span>
                      </li>
                    ))}
                    {stats?.read.length === 0 && <li className="empty-list">Nenhum registro.</li>}
                  </ul>
                </div>

                <div className="compliance-column">
                  <h5 className="list-title text-danger"><AlertCircle size={14} /> Pendentes de Leitura</h5>
                  <ul className="user-status-list">
                    {stats?.missing.map(m => (
                      <li key={m.id} className="status-missing">
                        <span className="username">{m.username}</span>
                      </li>
                    ))}
                    {stats?.missing.length === 0 && <li className="empty-list">Todos leram!</li>}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </main>

        <footer className="document-modal-footer">
          <div className="footer-actions-left">
            {showReadingAction && (
              hasMarked ? (
                <div className="reading-status-message">
                  <Clock size={18} />
                  <span>Leitura registrada. Aguardando validação do gestor.</span>
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

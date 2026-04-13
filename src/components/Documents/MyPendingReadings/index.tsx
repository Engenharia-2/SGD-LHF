import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, Calendar, Layers, CheckCircle } from 'lucide-react';
import { readingService } from '../../../services/readingService';
import { useAlert } from '../../../contexts/AlertContext';
import type { Document } from '../../../types';
import DocumentModal from '../DocumentModal';
import './styles.css';

const MyPendingReadings: React.FC = () => {
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const { showAlert } = useAlert();

  const fetchPending = async () => {
    try {
      const data = await readingService.getMyPendingReadings();
      setPendingDocs(data);
    } catch (err) {
      console.error('Erro ao buscar minhas leituras pendentes:', err);
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

  const handleMarkAsRead = async (id: number) => {
    try {
      await readingService.markAsRead(id);
      showAlert('Leitura registrada com sucesso! Aguarde a confirmação do gestor.', 'success');
      setPendingDocs(prev => prev.filter(doc => doc.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar como lido.';
      showAlert(errorMessage, 'error');
    }
  };

  if (loading || pendingDocs.length === 0) return null;

  return (
    <div className="my-pending-readings-container">
      <h3 className="my-pending-readings-title">
        <BookOpen size={20} />
        Minhas Leituras Obrigatórias
        <span className="badge">{pendingDocs.length}</span>
      </h3>
      
      <div className="my-pending-list">
        {pendingDocs.map(doc => (
          <div key={doc.id} className="my-pending-item" onClick={() => handleView(doc)}>
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
                onClick={() => handleMarkAsRead(doc.id)}
                title="Marcar como Lido"
              >
                <CheckCircle size={18} />
                <span>Marcar como Lido</span>
              </button>
            </div>
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

export default MyPendingReadings;

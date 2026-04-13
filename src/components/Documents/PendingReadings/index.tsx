import React, { useEffect, useState } from 'react';
import { Check, User, FileText, Clock } from 'lucide-react';
import { readingService } from '../../../services/readingService';
import { useAlert } from '../../../contexts/AlertContext';
import './styles.css';

interface PendingReading {
  id: number;
  document_id: number;
  user_id: number;
  username: string;
  document_title: string;
  doc_code: string;
  read_at: string;
}

const PendingReadings: React.FC = () => {
  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchPending = async () => {
    try {
      const data = await readingService.listPendingReadings();
      setPendingReadings(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar leituras pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await readingService.confirmReading(id);
      showAlert('Leitura confirmada com sucesso!', 'success');
      setPendingReadings(prev => prev.filter(r => r.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao confirmar leitura.';
      showAlert(errorMessage, 'error');
    }
  };

  if (loading || pendingReadings.length === 0) return null;

  return (
    <div className="pending-readings-container">
      <h3 className="pending-readings-title">
        Confirmações de Leitura Pendentes
        <span className="badge">{pendingReadings.length}</span>
      </h3>
      
      <div className="pending-readings-list">
        {pendingReadings.map(reading => (
          <div key={reading.id} className="pending-reading-item">
            <div className="reading-info">
              <div className="reading-user">
                <User size={16} />
                <span><strong>{reading.username}</strong> leu o documento:</span>
              </div>
              <div className="reading-doc">
                <FileText size={16} />
                <span>{reading.doc_code ? `[${reading.doc_code}] ` : ''}{reading.document_title}</span>
              </div>
              <div className="reading-time">
                <Clock size={14} />
                <span>{new Date(reading.read_at).toLocaleString('pt-BR')}</span>
              </div>
            </div>
            
            <div className="reading-actions">
              <button 
                className="btn-icon btn-approve-icon" 
                onClick={() => handleConfirm(reading.id)}
                title="Confirmar Leitura"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingReadings;

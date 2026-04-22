import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { readingService } from '../../../services/readingService';
import { useAlert } from '../../../contexts/AlertContext';
import type { Document } from '../../../types';
import DocumentModal from '../DocumentModal';
import MyReadingCard from './MyReadingCard';
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
          <MyReadingCard 
            key={doc.id} 
            doc={doc} 
            onMarkAsRead={handleMarkAsRead} 
            onView={handleView} 
          />
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

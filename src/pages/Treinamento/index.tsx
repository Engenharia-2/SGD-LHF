import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MyPendingReadings from '../../components/Documents/MyPendingReadings';
import DocumentList from '../../components/Documents/DocumentList';
import ComplianceTracker from '../../components/Admin/Compliance/ComplianceTracker/index';
import { readingService } from '../../services/readingService';
import type { Document } from '../../types';
import './styles.css';

const Treinamento: React.FC = () => {
  const { user } = useAuth();
  const [completedTrainings, setCompletedTrainings] = useState<Document[]>([]);

  useEffect(() => {
    if (user?.role === 'Funcionario') {
      const fetchHistory = async () => {
        try {
          // Busca o histórico do próprio usuário logado através do novo endpoint seguro
          const data = await readingService.getMyCompliance();
          // Filtra apenas as leituras concluídas (Lido ou Confirmado)
          const completed = data
            .filter((item: any) => item.status === 'Confirmado' || item.status === 'Lido')
            .map((item: any) => ({
              ...item,
              // Mapeia campos para compatibilidade com DocumentList se necessário
              uploaded_at: item.read_at 
            }));
          setCompletedTrainings(completed);
        } catch (err) {
          console.error('Erro ao buscar histórico de treinamentos:', err);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (!user) return null;

  const isAuditor = user.role === 'Gestor' || user.role === 'Administrador';

  return (
    <div className="treinamento-container page-container">
      <div className="page-header">
        <h2>Módulo de Treinamento e Conformidade</h2>
        <p className="page-description">
          {isAuditor 
            ? "Acompanhe a adesão dos colaboradores às normas e treinamentos da empresa."
            : "Gerencie seus treinamentos obrigatórios e consulte seu histórico de conformidade."}
        </p>
      </div>

      {isAuditor ? (
        <ComplianceTracker />
      ) : (
        <div className="training-user-view">
          <div className="view-section">
            <h3>Meus Treinamentos Pendentes</h3>
            <MyPendingReadings />
          </div>

          <div className="view-section">
            <h3>Histórico de Treinamentos Concluídos</h3>
            <DocumentList 
              documents={completedTrainings}
              user={user}
              title="Treinamentos Finalizados"
              emptyMessage="Você ainda não concluiu nenhum treinamento obrigatório."
              compact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Treinamento;

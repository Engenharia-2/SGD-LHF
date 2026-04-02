import React, { useEffect, useState } from 'react';
import DocumentList from '../../components/Documents/DocumentList';
import PendingApprovals from '../../components/Documents/PendingApprovals';
import { documentService } from '../../services/documentService';
import type { Document, User } from '../../types';

interface DashboardProps {
  user: User;
  pingResponse: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, pingResponse }) => {
  const [favorites, setFavorites] = useState<Document[]>([]);

  const fetchFavorites = async () => {
    try {
      const data = await documentService.listFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await documentService.unfavorite(id);
        setFavorites(prev => prev.filter(doc => doc.id !== id));
      } else {
        // No dashboard geralmente só removemos, mas por consistência:
        await documentService.favorite(id);
        fetchFavorites();
      }
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="status-card">
          <h2>Dashboard</h2>
          <p>Bem-vindo ao painel principal, {user.username}.</p>
          <p>Status do Electron: <span className="status success">{pingResponse}</span></p>
        </div>
        <div className="module-card">
          <h3>Resumo do Setor</h3>
          <p>Setor: <strong>{user.sector}</strong> | Cargo: <strong>{user.role}</strong></p>
        </div>
      </div>

      {(user.role === 'Gestor' || user.role === 'Administrador') && (
        <PendingApprovals />
      )}

      <DocumentList 
        documents={favorites}
        user={user}
        title="Documentos Favoritados"
        emptyMessage="Você ainda não possui documentos favoritados. Estrele documentos nos módulos de Processos ou Gestão para visualizá-los aqui."
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default Dashboard;


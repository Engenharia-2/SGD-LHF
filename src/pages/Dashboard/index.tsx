import React, { useEffect, useState } from 'react';
import DocumentList from '../../components/Documents/DocumentList';
import PendingApprovals from '../../components/Documents/PendingApprovals';
import PendingReadings from '../../components/Documents/PendingReadings';
import MyPendingReadings from '../../components/Documents/MyPendingReadings';
import { favoriteService } from '../../services/favoriteService';
import type { Document, User } from '../../types';
import './styles.css';

interface DashboardProps {
  user: User;
  pingResponse: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [favorites, setFavorites] = useState<Document[]>([]);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.list();
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
        await favoriteService.unfavorite(id);
        setFavorites(prev => prev.filter(doc => doc.id !== id));
      } else {
        // No dashboard geralmente só removemos, mas por consistência:
        await favoriteService.favorite(id);
        fetchFavorites();
      }
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
    }
  };

  const isAdminOrManager = user.role === 'Gestor' || user.role === 'Administrador';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-simple">
        <div className="welcome-section">
          <h2>Dashboard</h2>
          <p>Bem-vindo ao painel principal, <strong>{user.username}</strong>.</p>
        </div>
        <div className="info-section">
          <p>Setor: <strong>{user.sector}</strong> | Cargo: <strong>{user.role}</strong></p>
        </div>
      </div>

      {isAdminOrManager ? (
        <div className="dashboard-pending-grid">
          <PendingApprovals />
          <PendingReadings />
        </div>
      ) : (
        <div className="dashboard-user-grid">
          <MyPendingReadings />
          <DocumentList 
            documents={favorites}
            user={user}
            title="Documentos Favoritados"
            emptyMessage="Você ainda não possui documentos favoritados."
            onToggleFavorite={handleToggleFavorite}
            compact={true}
          />
        </div>
      )}

      {isAdminOrManager && (
        <DocumentList 
          documents={favorites}
          user={user}
          title="Documentos Favoritados"
          emptyMessage="Você ainda não possui documentos favoritados. Estrele documentos nos módulos de Processos ou Gestão para visualizá-los aqui."
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};
 export default Dashboard;
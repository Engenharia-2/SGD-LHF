import React from 'react';
import './styles.css';

interface DashboardProps {
  user: any;
  pingResponse: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, pingResponse }) => {
  return (
    <div className="dashboard-container">
      <div className="status-card">
        <h2>Dashboard</h2>
        <p>Bem-vindo ao painel principal, {user.username}.</p>
        <p>Status do Electron: <span className="status success">{pingResponse}</span></p>
      </div>
      <div className="modules-grid">
        <div className="module-card">
          <h3>Resumo do Setor</h3>
          <p>Você está logado no setor {user.sector} como {user.role}.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

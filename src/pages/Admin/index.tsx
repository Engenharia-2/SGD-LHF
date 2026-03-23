import React from 'react';
import './styles.css';

interface AdminProps {
  user: any;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      <div className="content-card">
        <p>Bem-vindo ao painel de controle, <strong>{user.username}</strong>.</p>
        <div className="admin-grid">
          <div className="admin-item">
            <h4>Gerenciar Usuários</h4>
            <p>Controle de permissões e novos acessos.</p>
            <button className="btn-admin">Acessar</button>
          </div>
          <div className="admin-item">
            <h4>Configurações do Sistema</h4>
            <p>Ajustes globais e logs de auditoria.</p>
            <button className="btn-admin">Acessar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import React, { Suspense, useMemo } from 'react';
import AdminList from '../../components/Admin/AdminList';
import CodeManager from '../../components/Admin/CodeManager';
import { userService } from '../../services/userService';
import type { User } from '../../types';
import './styles.css';

interface AdminProps {
  user: User;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  // Criamos a promise uma única vez ou quando necessário
  const usersPromise = useMemo(() => userService.listAll(), []);

  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      <Suspense fallback={<div className="loading-placeholder">Carregando lista de usuários...</div>}>
        <AdminList usersPromise={usersPromise} currentUser={user} />
      </Suspense>

      <CodeManager />
    </div>
  );
};

export default Admin;

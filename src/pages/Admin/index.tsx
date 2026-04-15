import React, { Suspense, useMemo } from 'react';
import AdminList from './AdminList';
import CodeManager from '../../components/Admin/CodeManager';
import type { User } from '../../types';
import './styles.css';

interface AdminProps {
  user: User;
}

// Função auxiliar para buscar usuários (Pode ser movida para um Service depois)
const fetchUsersPromise = async (): Promise<User[]> => {
  const token = localStorage.getItem('sgd_token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao carregar usuários');
  return data.data;
};

const Admin: React.FC<AdminProps> = () => {
  // Criamos a promise uma única vez ou quando necessário
  const usersPromise = useMemo(() => fetchUsersPromise(), []);

  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      <Suspense fallback={<div className="loading-placeholder">Carregando lista de usuários...</div>}>
        <AdminList usersPromise={usersPromise} />
      </Suspense>

      <CodeManager />
    </div>
  );
};

export default Admin;

import React, { useEffect, useState } from 'react';
import './styles.css';
import { useNotification } from '../../../hooks/useNotification';
import Notification from '../../../components/Layout/Notification';
import ConfirmModal from '../../../components/Layout/ConfirmModal';

const AdminList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const {
    notification,
    showNotification,
    hideNotification
  } = useNotification();

  const getHeaders = () => {
    const token = localStorage.getItem('sgd_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3003/admin/users', {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao carregar usuários');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAuthorize = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3003/admin/users/${id}/authorize`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, is_authorized: 1 } : u));
        showNotification('Usuário autorizado com sucesso!', 'success');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao autorizar');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:3003/admin/users/${userToDelete}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userToDelete));
        showNotification('Usuário removido com sucesso.', 'success');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao remover');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="admin-list-wrapper">
      <h3>Gestão de Usuários</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Setor</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.sector}</td>
              <td>{u.role}</td>
              <td>
                <span className={`status-badge ${u.is_authorized ? 'authorized' : 'pending'}`}>
                  {u.is_authorized ? 'Autorizado' : 'Pendente'}
                </span>
              </td>
              <td className="actions-cell">
                {!u.is_authorized && (
                  <button 
                    className="btn-action authorize" 
                    onClick={() => handleAuthorize(u.id)}
                  >
                    Autorizar
                  </button>
                )}
                <button 
                  className="btn-action reject" 
                  onClick={() => setUserToDelete(u.id)}
                >
                  {u.is_authorized ? 'Remover' : 'Recusar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal 
        isOpen={userToDelete !== null}
        title="Remover Usuário"
        message="Tem certeza que deseja remover ou recusar este usuário? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
        confirmText="Confirmar"
      />

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
    </div>
  );
};

export default AdminList;

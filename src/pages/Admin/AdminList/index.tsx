import React, { useEffect, useState } from 'react';
import './styles.css';
import { useAlert } from '../../../contexts/AlertContext';
import ConfirmModal from '../../../components/Layout/ConfirmModal';

const AdminList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const {
    showAlert,
  } = useAlert();

  const getHeaders = () => {
    const token = localStorage.getItem('sgd_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao carregar usuários');
      setUsers(data.data);
    } catch (err: any) {
      setError(err.message);
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAuthorize = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}/authorize`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, is_authorized: 1 } : u));
        showAlert(data.message || 'Usuário autorizado com sucesso!', 'success');
      } else {
        throw new Error(data.message || 'Erro ao autorizar');
      }
    } catch (err: any) {
      showAlert(err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userToDelete}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userToDelete));
        showAlert(data.message || 'Usuário removido com sucesso.', 'success');
      } else {
        throw new Error(data.message || 'Erro ao remover');
      }
    } catch (err: any) {
      showAlert(err.message, 'error');
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
    </div>
  );
};

export default AdminList;

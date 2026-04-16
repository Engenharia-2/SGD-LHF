import React, {  useState, use } from 'react';
import './styles.css';
import { useAlert } from '../../../contexts/AlertContext';
import ConfirmModal from '../../../components/Layout/ConfirmModal';
import { userService } from '../../../services/userService';
import type { User } from '../../../types';

interface AdminListProps {
  usersPromise: Promise<User[]>;
  currentUser: User;
}

const AdminList: React.FC<AdminListProps> = ({ usersPromise, currentUser }) => {
  // O hook use() suspende o componente até a promise resolver
  const initialUsers = use(usersPromise);
  
  // Usamos o resultado inicial para popular nosso estado local (para mutações rápidas)
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToReset, setUserToReset] = useState<number | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const {
    showAlert,
  } = useAlert();

  const handleAuthorize = async (id: number) => {
    try {
      const data = await userService.authorize(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_authorized: true } : u));
      showAlert(data.message || 'Usuário autorizado com sucesso!', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao autorizar';
      showAlert(errorMessage, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const data = await userService.delete(userToDelete);
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      showAlert(data.message || 'Usuário removido com sucesso.', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover';
      showAlert(errorMessage, 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleResetPassword = async () => {
    if (!userToReset) return;

    // Gera uma senha temporária simples
    const tempPassword = `LHF@${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await userService.resetPassword(userToReset, tempPassword);
      setResetResult(tempPassword);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao redefinir senha';
      showAlert(errorMessage, 'error');
    } finally {
      setUserToReset(null);
    }
  };

  const canReset = currentUser.role === 'Administrador' || currentUser.role === 'Gestor';

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
                {canReset && (
                  <button 
                    className="btn-action reset" 
                    onClick={() => setUserToReset(u.id)}
                    title="Redefinir Senha"
                  >
                    Redefinir
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

      <ConfirmModal 
        isOpen={userToReset !== null}
        title="Redefinir Senha"
        message="Tem certeza que deseja redefinir a senha deste usuário? Uma nova senha temporária será gerada e exibida."
        onConfirm={handleResetPassword}
        onCancel={() => setUserToReset(null)}
        confirmText="Redefinir"
      />

      <ConfirmModal 
        isOpen={resetResult !== null}
        title="Senha Redefinida"
        message={`A senha foi redefinida com sucesso. A nova senha temporária é: ${resetResult}`}
        onConfirm={() => setResetResult(null)}
        onCancel={() => setResetResult(null)}
        confirmText="Entendido"
        cancelText="Fechar"
        type="info"
      />
    </div>
  );
};

export default AdminList;

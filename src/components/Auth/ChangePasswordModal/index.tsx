import React, { useState } from 'react';
import './styles.css';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import { authService } from '../../../services/authService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert('A nova senha e a confirmação não coincidem.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('A nova senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      showAlert('Senha alterada com sucesso!', 'success');
      onClose();
      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha';
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay change-password-overlay">
      <div className="modal-content change-password-modal">
        <div className="modal-header">
          <div className="title-with-icon">
            <Lock className="icon" size={22} />
            <h3>Alterar Senha</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual</label>
            <div className="input-with-icon">
              <ShieldCheck size={18} className="input-icon" />
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Digite sua senha atual"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Digite a nova senha"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? 'Alterando...' : 'Confirmar Alteração'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

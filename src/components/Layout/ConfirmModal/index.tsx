import React from 'react';
import './styles.css';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay confirm-overlay">
      <div className={`modal-content confirm-modal ${type}`}>
        <div className="modal-header">
          <div className="title-with-icon">
            <AlertTriangle className="icon" size={22} />
            <h3>{title}</h3>
          </div>
          <button className="btn-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        
        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer confirm-footer">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn-confirm btn-${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

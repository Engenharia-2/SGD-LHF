import React, { useEffect } from 'react';
import './styles.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="icon" size={20} />,
    error: <AlertCircle className="icon" size={20} />,
    info: <Info className="icon" size={20} />,
  };

  return (
    <div className={`alert-container ${type}`}>
      <div className="alert-content">
        {icons[type]}
        <span className="message">{message}</span>
      </div>
      <button className="btn-close-alert" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;

import React, { useEffect } from 'react';
import './styles.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
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
    <div className={`notification-container ${type}`}>
      <div className="notification-content">
        {icons[type]}
        <span className="message">{message}</span>
      </div>
      <button className="btn-close-notif" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;

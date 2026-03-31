import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import type { Notification } from '../types';

interface NotificationContextData {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${user.id}/${user.sector}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.map((n: any) => ({ ...n, is_read: !!n.is_read })));
      }
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    console.log('NotificationContext: markAsRead chamado para ID:', id, 'User:', user);
    if (!user || !user.id) {
      console.warn('NotificationContext: Tentativa de marcar notificação como lida sem usuário logado.');
      return;
    }
    
    try {
      const url = `${import.meta.env.VITE_API_URL}/notifications/read/${user.id}/${id}`;
      console.log('NotificationContext: Fetch para URL:', url);
      const response = await fetch(url, {
        method: 'POST'
      });
      console.log('NotificationContext: Status da resposta:', response.status);
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      } else {
        const errorData = await response.json();
        console.error('NotificationContext: Erro ao marcar como lida no servidor:', errorData);
      }
    } catch (err) {
      console.error('NotificationContext: Erro de rede ao marcar como lida:', err);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/notifications/stream/${user.sector}`);

      eventSource.onmessage = (event) => {
        const newNotif = JSON.parse(event.data);
        
        // Se a notificação for direcionada a um usuário específico, filtrar
        if (newNotif.target_user_id && newNotif.target_user_id !== user.id) {
          return;
        }

        setNotifications(prev => [
          { ...newNotif, is_read: false },
          ...prev
        ]);
        
        // Mostrar o alerta visual
        showAlert(newNotif.message, newNotif.type);
      };

      eventSource.onerror = (err) => {
        console.error('Erro SSE:', err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications, showAlert]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

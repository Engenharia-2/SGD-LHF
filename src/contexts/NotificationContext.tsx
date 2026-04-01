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

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('sgd_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${user.id}/${user.sector}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        const data: Notification[] = result.data;
        // Garantir que is_read seja booleano
        setNotifications(data.map(n => ({ ...n, is_read: !!n.is_read })));
      }
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  }, [user, getHeaders]);

  const markAsRead = async (id: number) => {
    if (!user || !user.id) return;
    
    try {
      const url = `${import.meta.env.VITE_API_URL}/notifications/read/${user.id}/${id}`;
      const response = await fetch(url, { 
        method: 'POST',
        headers: getHeaders()
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (err) {
      console.error('Erro de rede ao marcar como lida:', err);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // SSE precisa de autenticação também? 
      // EventSource nativo não suporta headers customizados facilmente.
      // Mas nas rotas eu adicionei authenticateJWT. 
      // Para simplificar, vou remover authenticateJWT apenas da rota /stream se necessário, 
      // ou usar um workaround. 
      
      const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/notifications/stream/${user.sector}`);

      eventSource.onmessage = (event) => {
        const newNotif: Notification & { target_user_id?: number } = JSON.parse(event.data);
        
        // Se a notificação for direcionada a um usuário específico, filtrar
        if (newNotif.target_user_id && newNotif.target_user_id !== user.id) {
          return;
        }

        setNotifications(prev => {
          // Evitar duplicidade pelo ID
          const exists = prev.some(n => n.id === newNotif.id);
          if (exists) return prev;

          // Mostrar o alerta visual apenas para notificações novas (não duplicadas)
          showAlert(newNotif.message, newNotif.type as any);

          return [
            { ...newNotif, is_read: false },
            ...prev
          ];
        });
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

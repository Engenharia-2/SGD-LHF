import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Filter, Bell, FileText, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import './styles.css';

const SECTORS = [
  "Qualidade", "Produção", "Administrativo", "Vendas", 
  "Assistência", "Estoque", "Engenharia", "Geral"
];

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user: _userProp, onLogout: _onLogoutProp }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);
  
  const { theme, toggleTheme } = useTheme();
  const { user, logout, activeSector, changeSector, canChangeSector } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se o clique for fora do container de perfil, fecha o menu de perfil
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      // Se o clique for fora do container de notificações, fecha o menu de notificações
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const handleMarkRead = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {canChangeSector ? (
          <div className="sector-selector-wrapper">
            <Filter size={16} className="selector-icon" />
            <select 
              className="header-sector-select" 
              value={activeSector} 
              onChange={(e) => changeSector(e.target.value)}
            >
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ) : (
          <span className="header-sector">{user.sector}</span>
        )}
      </div>

      <div className="header-right">
        {/* Container de Notificações - Ref engloba TUDO */}
        <div className="notification-bell-wrapper" ref={notifContainerRef}>
          <button 
            className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }}
            title="Notificações"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifMenu && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h3>Notificações</h3>
                <span className="notif-count">{unreadCount} não lidas</span>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="no-notif">Nenhuma notificação por enquanto.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notif-item ${n.is_read ? 'read' : 'unread'}`}>
                      <div className="notif-icon">
                        <FileText size={18} />
                      </div>
                      <div className="notif-content">
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-message">{n.message}</p>
                        <span className="notif-date">{formatDate(n.created_at)}</span>
                      </div>
                      {!n.is_read && (
                        <button 
                          className="btn-mark-read" 
                          onClick={(e) => handleMarkRead(e, n.id)}
                          title="Marcar como lida"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme} title="Alternar Tema">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Container de Perfil - Ref engloba TUDO */}
        <div className="user-profile-container" ref={profileContainerRef}>
          <div 
            className="user-profile-trigger" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
          >
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className={`arrow-icon ${showProfileMenu ? 'open' : ''}`} size={16} />
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-name">{user.username}</p>
                <p className="dropdown-role">{user.role}</p>
                <p className="dropdown-sector-info">Setor Origem: {user.sector}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="btn-logout-header" onClick={handleLogout}>
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

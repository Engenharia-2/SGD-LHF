import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Filter } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import './styles.css';

const SECTORS = [
  "Qualidade", "Produção", "Administrativo", "Vendas", 
  "Assistência", "Estoque", "Engenharia", "Geral"
];

const Header: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, activeSector, changeSector, canChangeSector } = useAuth();

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">SGD-LHF</h1>
        <div className="header-divider"></div>
        
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

      <div className="header-right" ref={dropdownRef}>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Alternar Tema">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div 
          className="user-profile-trigger" 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
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
            <button className="btn-logout-header" onClick={logout}>
              Sair da Conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

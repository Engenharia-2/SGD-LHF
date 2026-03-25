import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Users, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import './styles.css';

interface SidebarProps {
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const isAdminOrManager = user?.role === 'Administrador' || user?.role === 'Gestor';
  const { theme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img 
          src={theme === 'light' ? '/logotipo2.png' : '/logotipo3.png'} 
          alt="SGD-LHF Logo" 
          className="sidebar-logo" 
        />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/processos" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FileText size={20} />
              <span>Processos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/gestao" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Settings size={20} />
              <span>Gestão</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/geral" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Users size={20} />
              <span>Geral</span>
            </NavLink>
          </li>
          {isAdminOrManager && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                <ShieldCheck size={20} />
                <span>Admin</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>Versão 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

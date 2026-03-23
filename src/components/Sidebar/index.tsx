import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles.css';

interface SidebarProps {
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const isAdminOrManager = user?.role === 'Administrador' || user?.role === 'Gestor';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SGD-LHF</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/processos" className={({ isActive }) => (isActive ? 'active' : '')}>
              Processos
            </NavLink>
          </li>
          <li>
            <NavLink to="/gestao" className={({ isActive }) => (isActive ? 'active' : '')}>
              Gestão
            </NavLink>
          </li>
          <li>
            <NavLink to="/geral" className={({ isActive }) => (isActive ? 'active' : '')}>
              Geral
            </NavLink>
          </li>
          {isAdminOrManager && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                Admin
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

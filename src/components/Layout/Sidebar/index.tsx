import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  GraduationCap, 
  BookOpen, 
  ClipboardList, 
  FileSpreadsheet,
  ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { User } from '../../../types';
import './styles.css';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const isAdminOrManager = user?.role === 'Administrador' || user?.role === 'Gestor';
  const { theme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img 
          src={theme === 'light' ? 'logotipo2.png' : 'logotipo3.png'} 
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
            <NavLink to="/normas" className={({ isActive }) => (isActive ? 'active' : '')}>
              <BookOpen size={20} />
              <span>Normas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/formularios" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FileSpreadsheet size={20} />
              <span>Formulários</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/relatorios" className={({ isActive }) => (isActive ? 'active' : '')}>
              <BarChart3 size={20} />
              <span>Relatórios</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/atas" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ClipboardList size={20} />
              <span>Atas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/treinamento" className={({ isActive }) => (isActive ? 'active' : '')}>
              <GraduationCap size={20} />
              <span>Treinamento</span>
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

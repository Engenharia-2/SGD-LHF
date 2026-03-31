import React from 'react';
import AdminList from './AdminList';
import './styles.css';

interface AdminProps {
  user: any;
}

const Admin: React.FC<AdminProps> = ( ) => {
  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      <AdminList />
    </div>
  );
};

export default Admin;

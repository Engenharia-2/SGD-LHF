import React from 'react';
import './styles.css';

const Geral: React.FC = () => {
  return (
    <div className="geral-container">
      <h2>Informações Gerais</h2>
      <div className="content-card">
        <p>Documentos e informações gerais do sistema.</p>
        <div className="placeholder-content">
          <p>Módulo em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

export default Geral;

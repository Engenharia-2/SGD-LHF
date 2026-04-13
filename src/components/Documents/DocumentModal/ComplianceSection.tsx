import React from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';

interface ComplianceSectionProps {
  stats: {
    read: Array<{ id: number, username: string, status: string }>;
    missing: Array<{ id: number, username: string }>;
  } | null;
  loading: boolean;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ stats, loading }) => {
  return (
    <section className="compliance-section">
      <div className="compliance-header">
        <h4><Users size={18} /> Controle de Conformidade (Leitura)</h4>
        {loading && <span className="loading-small">Atualizando...</span>}
      </div>
      
      <div className="compliance-grid">
        <div className="compliance-column">
          <h5 className="list-title text-success"><CheckCircle size={14} /> Lidos e Confirmados</h5>
          <ul className="user-status-list">
            {stats?.read.map(r => (
              <li key={r.id} className={r.status === 'Confirmado' ? 'status-ok' : 'status-pending'}>
                <span className="username">{r.username}</span>
                <span className="status-label">{r.status === 'Confirmado' ? 'OK' : 'Pendente'}</span>
              </li>
            ))}
            {stats?.read.length === 0 && <li className="empty-list">Nenhum registro.</li>}
          </ul>
        </div>

        <div className="compliance-column">
          <h5 className="list-title text-danger"><AlertCircle size={14} /> Pendentes de Leitura</h5>
          <ul className="user-status-list">
            {stats?.missing.map(m => (
              <li key={m.id} className="status-missing">
                <span className="username">{m.username}</span>
              </li>
            ))}
            {stats?.missing.length === 0 && <li className="empty-list">Todos leram!</li>}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;

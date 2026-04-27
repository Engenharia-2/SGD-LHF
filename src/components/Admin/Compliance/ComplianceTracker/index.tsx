import React from 'react';
import { User, FileText, Search, ChevronRight } from 'lucide-react';
import { useComplianceTracker } from '../../../../hooks/useComplianceTracker';
import './styles.css';

const ComplianceTracker: React.FC = () => {
  const {
    viewMode,
    searchTerm,
    setSearchTerm,
    toggleViewMode,
    selectedUser,
    userCompliance,
    selectedNorm,
    normCompliance,
    loading,
    handleUserSelect,
    handleNormSelect,
    filteredCollaborators,
    filteredNorms
  } = useComplianceTracker();

  return (
    <div className="compliance-tracker-container">
      <div className="compliance-sidebar">
        <div className="view-mode-selector">
          <button 
            className={viewMode === 'user' ? 'active' : ''} 
            onClick={() => toggleViewMode('user')}
          >
            Usuário
          </button>
          <button 
            className={viewMode === 'norm' ? 'active' : ''} 
            onClick={() => toggleViewMode('norm')}
          >
            Documento
          </button>
        </div>

        <div className="compliance-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder={viewMode === 'user' ? "Buscar colaborador..." : "Buscar norma..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="compliance-list">
          {viewMode === 'user' ? (
            filteredCollaborators.map(c => (
              <div 
                key={c.id} 
                className={`compliance-list-item ${selectedUser?.id === c.id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(c)}
              >
                <div className="item-info">
                  <span className="item-title">{c.username}</span>
                  <span className="item-subtitle">{c.sector}</span>
                </div>
                <ChevronRight size={16} />
              </div>
            ))
          ) : (
            filteredNorms.map(n => (
              <div 
                key={n.id} 
                className={`compliance-list-item ${selectedNorm?.id === n.id ? 'selected' : ''}`}
                onClick={() => handleNormSelect(n)}
              >
                <div className="item-info">
                  <span className="item-title">{n.doc_code || 'S/C'}</span>
                  <span className="item-subtitle" title={n.title}>{n.title}</span>
                </div>
                <ChevronRight size={16} />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="compliance-content">
        {!selectedUser && !selectedNorm ? (
          <div className="empty-compliance-state">
            <Search size={48} />
            <p>Selecione um {viewMode === 'user' ? 'colaborador' : 'norma'} na lista ao lado para visualizar os detalhes de conformidade.</p>
          </div>
        ) : loading ? (
          <div className="compliance-loading">Carregando dados...</div>
        ) : selectedUser ? (
          <div className="compliance-details">
            <header className="details-header">
              <div className="header-icon"><User size={24} /></div>
              <div>
                <h3>{selectedUser.username}</h3>
                <p>{selectedUser.sector}</p>
              </div>
            </header>

            <div className="compliance-stats-grid">
              <div className="stat-card success">
                <span className="stat-value">{userCompliance.filter(i => i.status === 'Confirmado').length}</span>
                <span className="stat-label">Concluídos</span>
              </div>
              <div className="stat-card warning">
                <span className="stat-value">{userCompliance.filter(i => i.status === 'Lido').length}</span>
                <span className="stat-label">Aguardando Confirmação</span>
              </div>
              <div className="stat-card danger">
                <span className="stat-value">{userCompliance.filter(i => i.status === 'Pendente').length}</span>
                <span className="stat-label">Pendentes</span>
              </div>
            </div>

            <div className="compliance-table-container">
              <table className="compliance-table">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Data Leitura</th>
                  </tr>
                </thead>
                <tbody>
                  {userCompliance.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="doc-cell">
                          <FileText size={16} />
                          <span>{item.doc_code ? `[${item.doc_code}] ` : ''}{item.title}</span>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.read_at ? new Date(item.read_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedNorm && (
          <div className="compliance-details">
            <header className="details-header">
              <div className="header-icon"><FileText size={24} /></div>
              <div>
                <h3>{selectedNorm.doc_code} - {selectedNorm.title}</h3>
                <p>Categoria: {selectedNorm.category} | Setor: {selectedNorm.sector}</p>
              </div>
            </header>

            <div className="compliance-stats-grid">
              <div className="stat-card success">
                <span className="stat-value">{normCompliance.filter(i => i.status === 'Confirmado').length}</span>
                <span className="stat-label">Leituras Confirmadas</span>
              </div>
              <div className="stat-card warning">
                <span className="stat-value">{normCompliance.filter(i => i.status === 'Lido').length}</span>
                <span className="stat-label">Lidos (Aguardando Gestor)</span>
              </div>
              <div className="stat-card danger">
                <span className="stat-value">{normCompliance.filter(i => !i.status || i.status === 'Pendente').length}</span>
                <span className="stat-label">Não Lidos</span>
              </div>
            </div>

            <div className="compliance-table-container">
              <table className="compliance-table">
                <thead>
                  <tr>
                    <th>Colaborador</th>
                    <th>Setor</th>
                    <th>Status</th>
                    <th>Data Leitura</th>
                  </tr>
                </thead>
                <tbody>
                  {normCompliance.map(item => (
                    <tr key={item.user_id}>
                      <td>
                        <div className="user-cell">
                          <User size={16} />
                          <span>{item.username}</span>
                        </div>
                      </td>
                      <td>{item.sector}</td>
                      <td>
                        <span className={`status-badge ${(item.status || 'Pendente').toLowerCase()}`}>
                          {item.status || 'Pendente'}
                        </span>
                      </td>
                      <td>
                        {item.read_at ? new Date(item.read_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceTracker;

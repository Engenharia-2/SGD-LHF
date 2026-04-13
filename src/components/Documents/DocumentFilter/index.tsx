import React, { useState, useEffect } from 'react';
import './styles.css';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface Filters {
  doc_code: string;
  title: string;
  responsible: string;
  date: string;
  version: string;
  status: string;
}

interface DocumentFilterProps {
  onFilter: (filters: Filters) => void;
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    doc_code: '',
    title: '',
    responsible: '',
    date: '',
    version: '',
    status: ''
  });

  // Atualiza os filtros no componente pai sempre que algum valor mudar
  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleReset = () => {
    setFilters({
      doc_code: '',
      title: '',
      responsible: '',
      date: '',
      version: '',
      status: ''
    });
  };

  return (
    <div className={`document-filter-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="filter-title">
          <Filter size={20} />
          <span>Filtrar Documentos</span>
        </div>
        <div className="filter-summary">
          {Object.values(filters).some(v => v !== '') && (
            <span className="active-badge">Filtros Ativos</span>
          )}
          <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      <div className="filter-content">
        <div className="filter-grid">
          <div className="filter-group">
            <label>Código</label>
            <input 
              type="text" 
              placeholder="Ex: PQS-1" 
              value={filters.doc_code}
              onChange={(e) => setFilters({ ...filters, doc_code: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Título</label>
            <div className="input-with-icon">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Buscar por título..." 
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Responsável</label>
            <input 
              type="text" 
              placeholder="Nome do responsável..." 
              value={filters.responsible}
              onChange={(e) => setFilters({ ...filters, responsible: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Data de Criação</label>
            <input 
              type="date" 
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Versão</label>
            <input 
              type="text" 
              placeholder="Ex: 1.0" 
              value={filters.version}
              onChange={(e) => setFilters({ ...filters, version: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos os Status</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Obsoleto">Obsoleto</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-reset" onClick={handleReset}>
            <RotateCcw size={16} /> Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilter;
export type { Filters };

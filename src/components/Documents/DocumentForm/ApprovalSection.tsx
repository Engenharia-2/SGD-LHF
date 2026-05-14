import React from 'react';
import type { User } from '../../../types';
import { REGISTRABLE_SECTORS } from '../../../utils/constants';

interface ApprovalSectionProps {
  isRelatorio: boolean;
  isAtas: boolean;
  availableApprovers: User[];
  approverIds: number[];
  setApproverIds: React.Dispatch<React.SetStateAction<number[]>>;
  availableReaders: User[];
  readerIds: number[];
  setReaderIds: React.Dispatch<React.SetStateAction<number[]>>;
  targetSectors: string[];
  setTargetSectors: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({
  isRelatorio,
  isAtas,
  availableApprovers,
  approverIds,
  setApproverIds,
  availableReaders,
  readerIds,
  setReaderIds,
  targetSectors,
  setTargetSectors,
  isLoading
}) => {
  const toggleApprover = (id: number) => {
    setApproverIds(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleReader = (id: number) => {
    setReaderIds(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSector = (s: string) => {
    setTargetSectors(prev => 
      prev.includes(s) ? (prev.length > 1 ? prev.filter(sec => sec !== s) : prev) : [...prev, s]
    );
  };

  return (
    <>
      <div className="form-group">
        <label>{isRelatorio ? 'Selecionar Leitores (Obrigatório)' : 'Selecionar Aprovadores (Obrigatório)'}</label>
        <div className="multi-select-box approvers-grid">
          {availableApprovers.map(app => (
            <label key={app.id} className="checkbox-item">
              <input 
                type="checkbox" 
                checked={approverIds.includes(app.id)}
                onChange={() => toggleApprover(app.id)}
              />
              <span>{app.username} ({app.sector})</span>
            </label>
          ))}
          {isLoading && availableApprovers.length === 0 && (
            <p className="empty-info">Carregando usuários...</p>
          )}
          {!isLoading && availableApprovers.length === 0 && (
            <p className="empty-info">Nenhum usuário disponível.</p>
          )}
        </div>
      </div>

      {isAtas && (
        <div className="form-group">
          <label>Selecionar Leitores Obrigatórios (Opcional)</label>
          <div className="multi-select-box readers-grid">
            {availableReaders.map(reader => (
              <label key={reader.id} className="checkbox-item">
                <input 
                  type="checkbox" 
                  checked={readerIds.includes(reader.id)}
                  onChange={() => toggleReader(reader.id)}
                />
                <span>{reader.username} ({reader.sector})</span>
              </label>
            ))}
            {isLoading && availableReaders.length === 0 && (
              <p className="empty-info">Carregando usuários...</p>
            )}
            {!isLoading && availableReaders.length === 0 && (
              <p className="empty-info">Nenhum usuário disponível.</p>
            )}
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Disponibilizar para Setores</label>
        <div className="multi-select-box sectors-grid">
          {REGISTRABLE_SECTORS.map(s => (
            <label key={s} className="checkbox-item">
              <input 
                type="checkbox" 
                checked={targetSectors.includes(s)}
                onChange={() => toggleSector(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <div className="select-all-sectors">
          <label className="checkbox-item select-all-label">
            <input 
              type="checkbox"
              checked={targetSectors.length === REGISTRABLE_SECTORS.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setTargetSectors([...REGISTRABLE_SECTORS]);
                } else {
                  // Se desmarcar, mantemos o primeiro setor da lista para não ficar vazio
                  // ou deixamos vazio e validamos no submit? 
                  // A lógica original impedia ficar vazio no toggle.
                  setTargetSectors([REGISTRABLE_SECTORS[0]]);
                }
              }}
            />
            <span>Marcar todos setores</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default ApprovalSection;

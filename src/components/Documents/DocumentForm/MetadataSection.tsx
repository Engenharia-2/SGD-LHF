import React from 'react';
import type { Document } from '../../../types';
import type { DocumentCode } from '../../../services/codeService';

interface MetadataSectionProps {
  initialData?: Document;
  docCode: string;
  setDocCode: (code: string) => void;
  availableCodes: DocumentCode[];
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  version: string;
  setVersion: (version: string) => void;
  revisionPeriod: number;
  setRevisionPeriod: (period: number) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({
  initialData,
  docCode,
  setDocCode,
  availableCodes,
  title,
  setTitle,
  description,
  setDescription,
  version,
  setVersion,
  revisionPeriod,
  setRevisionPeriod
}) => {
  return (
    <>
      <div className="form-row">
        <div className="form-group code-group">
          <label>Código do Registro</label>
          <select 
            value={docCode}
            onChange={(e) => setDocCode(e.target.value)}
            disabled={!!initialData}
            required
          >
            {!initialData && <option value="">Selecione um código...</option>}
            {availableCodes.map(code => (
              <option key={code.id} value={code.prefix}>
                {code.prefix} - {code.description}
              </option>
            ))}
            {initialData && !availableCodes.some(c => c.prefix === docCode) && (
              <option value={docCode}>{docCode}</option>
            )}
          </select>
          <small className="help-text">O sistema gerará automaticamente o próximo número sequencial para o prefixo escolhido.</small>
        </div>

        <div className="form-group title-group">
          <label>Título do Registro</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Instrução de Trabalho"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descrição Detalhada</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o propósito e conteúdo deste documento..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Versão</label>
          <input 
            type="text" 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0"
            required
          />
        </div>
        <div className="form-group">
          <label>Periodicidade de Revisão</label>
          <select 
            value={revisionPeriod}
            onChange={(e) => setRevisionPeriod(Number(e.target.value))}
          >
            <option value={0}>Sem revisão agendada</option>
            <option value={1}>1 Ano</option>
            <option value={2}>2 Anos</option>
            <option value={3}>3 Anos</option>
            <option value={4}>4 Anos</option>
            <option value={5}>5 Anos</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default MetadataSection;

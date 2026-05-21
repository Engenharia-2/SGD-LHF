import React, { useState } from 'react';
import type { Document } from '../../../types';
import { useDocumentFormSetup } from '../../../hooks/useDocumentFormSetup';
import MetadataSection from './MetadataSection';
import FileUploadSection from './FileUploadSection';
import ApprovalSection from './ApprovalSection';
import './styles.css';

interface DocumentFormProps {
  initialData?: Document;
  user: {
    id: number;
    username: string;
    sector: string;
  };
  category: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isUploading: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ 
  initialData, 
  user, 
  category, 
  onSubmit, 
  onCancel,
  isUploading
}) => {
  const isRelatorio = category === 'RELATORIOS';
  const isAtas = category === 'ATAS';

  const getNextVersion = (v: string) => {
    if (!v) return '1.0';
    const parts = v.split('.');
    if (parts.length === 2 && !isNaN(Number(parts[1]))) {
      return `${parts[0]}.${Number(parts[1]) + 1}`;
    }
    return v;
  };

  const [docCode, setDocCode] = useState(initialData?.doc_code || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [version, setVersion] = useState(initialData ? getNextVersion(initialData.version) : '1.0');
  const [revisionPeriod, setRevisionPeriod] = useState<number>(initialData?.revision_period_years || 0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [approverIds, setApproverIds] = useState<number[]>([]);
  const [readerIds, setReaderIds] = useState<number[]>([]);
  const [targetSectors, setTargetSectors] = useState<string[]>(initialData?.sector ? [initialData.sector] : [user.sector]);
  const [editJustification, setEditJustification] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Hook isola toda a chamada de rede e gerenciamento de carregamento de dependências
  const { 
    availableCodes, 
    availableApprovers, 
    availableReaders, 
    isLoading, 
    error: hookError 
  } = useDocumentFormSetup({
    userId: user.id,
    category,
    isRelatorio,
    isAtas,
    initialData,
    currentDocCode: docCode,
    setDocCode
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !initialData) {
      setFormError('Por favor, selecione pelo menos um arquivo.');
      return;
    }
    if (approverIds.length === 0) {
      setFormError(isRelatorio ? 'Selecione pelo menos um leitor.' : 'Selecione pelo menos um aprovador.');
      return;
    }
    if (!docCode) {
      setFormError('Por favor, selecione um código de registro.');
      return;
    }

    if (initialData && !editJustification) {
      setFormError('Por favor, informe a justificativa para esta revisão.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    formData.append('doc_code', docCode);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sector', user.sector);
    formData.append('category', category);
    formData.append('responsible', user.username);
    formData.append('version', version);
    formData.append('revision_period_years', revisionPeriod.toString());
    formData.append('status', isRelatorio ? 'Aprovado' : 'Revisão');
    formData.append('creation_date', new Date().toISOString().split('T')[0]);
    formData.append('approverIds', JSON.stringify(approverIds));
    formData.append('readerIds', JSON.stringify(readerIds));
    formData.append('targetSectors', JSON.stringify(targetSectors));
    
    if (initialData) {
      formData.append('parent_id', (initialData.parent_id || initialData.id).toString());
      formData.append('previous_version_id', initialData.id.toString());
      formData.append('edit_justification', editJustification);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="document-form-container">
      {(formError || hookError) && <p className="upload-error">{formError || hookError}</p>}

      <div className="form-sections-container">
        {/* Coluna da Esquerda: Informações de Texto e Arquivos */}
        <div className="form-main-info">
          <MetadataSection
            initialData={initialData}
            docCode={docCode}
            setDocCode={setDocCode}
            availableCodes={availableCodes}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            version={version}
            setVersion={setVersion}
            revisionPeriod={revisionPeriod}
            setRevisionPeriod={setRevisionPeriod}
            editJustification={editJustification}
            setEditJustification={setEditJustification}
          />

          <FileUploadSection
            initialData={initialData}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            title={title}
            setTitle={setTitle}
          />
        </div>

        {/* Coluna da Direita: Seletores de Aprovadores e Setores */}
        <div className="form-approval-info">
          <ApprovalSection
            isRelatorio={isRelatorio}
            isAtas={isAtas}
            availableApprovers={availableApprovers}
            approverIds={approverIds}
            setApproverIds={setApproverIds}
            availableReaders={availableReaders}
            readerIds={readerIds}
            setReaderIds={setReaderIds}
            targetSectors={targetSectors}
            setTargetSectors={setTargetSectors}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={isUploading || isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-submit" disabled={isUploading || isLoading || (selectedFiles.length === 0 && !initialData)}>
          {isUploading ? 'Processando...' : initialData ? 'Criar Nova Versão' : (isRelatorio ? 'Publicar Relatório' : 'Enviar para Aprovação')}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;

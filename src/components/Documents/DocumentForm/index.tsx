import React, { useState, useRef, useEffect } from 'react';
import type { User, Document } from '../../../types';
import { X, FileText, Upload, Plus } from 'lucide-react';
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

const AVAILABLE_SECTORS = [
  'Qualidade', 'Produção', 'Administrativo', 'Vendas', 
  'Assistência', 'Estoque', 'Engenharia', 'Geral'
];

const DocumentForm: React.FC<DocumentFormProps> = ({ 
  initialData, 
  user, 
  category, 
  onSubmit, 
  onCancel,
  isUploading
}) => {
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [approverIds, setApproverIds] = useState<number[]>([]);
  const [targetSectors, setTargetSectors] = useState<string[]>(initialData?.sector ? [initialData.sector] : [user.sector]);
  const [availableApprovers, setAvailableApprovers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('sgd_token')}` }
    })
    .then(res => res.json())
    .then(result => {
      if (result.status === 'success' && Array.isArray(result.data)) {
        const approvers = result.data.filter((u: User) => 
          (u.role === 'Gestor' || u.role === 'Administrador') && u.id !== user.id
        );
        setAvailableApprovers(approvers);
      }
    })
    .catch(err => console.error('Erro ao buscar aprovadores:', err));
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      if (!title && newFiles.length > 0) {
        setTitle(newFiles[0].name.split('.')[0]);
      }
      
      // Reset input to allow selecting same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleApprover = (id: number) => {
    setApproverIds(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSector = (s: string) => {
    setTargetSectors(prev => 
      prev.includes(s) ? (prev.length > 1 ? prev.filter(sec => sec !== s) : prev) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !initialData) {
      setError('Por favor, selecione pelo menos um arquivo.');
      return;
    }
    if (approverIds.length === 0) {
      setError('Selecione pelo menos um aprovador.');
      return;
    }

    const formData = new FormData();
    // Suporte a múltiplos arquivos usando a chave 'files'
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
    formData.append('status', 'Revisão');
    formData.append('creation_date', new Date().toISOString().split('T')[0]);
    formData.append('approverIds', JSON.stringify(approverIds));
    formData.append('targetSectors', JSON.stringify(targetSectors));
    
    if (initialData) {
      formData.append('parent_id', (initialData.parent_id || initialData.id).toString());
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="document-form-container">
      {error && <p className="upload-error">{error}</p>}

      <div className="form-sections-container">
        {/* Coluna da Esquerda: Informações de Texto e Arquivos */}
        <div className="form-main-info">
          <div className="form-row">
            <div className="form-group code-group">
              <label>Código do Registro</label>
              <input 
                type="text" 
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                placeholder="Ex: PQS"
                disabled={!!initialData}
              />
              <small className="help-text">Se digitar apenas o prefixo (ex: PQS), o sistema gerará o próximo número.</small>
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

          <div className="form-group file-upload-group">
            <label>Documentos (Arquivos)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                multiple
                onChange={handleFileChange}
              />
              <button 
                type="button"
                className="btn-add-files"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={18} />
                Selecionar Arquivos
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="selected-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="file-item-badge">
                    <FileText size={14} />
                    <span title={file.name}>{file.name}</span>
                    <button 
                      type="button" 
                      className="btn-remove-file"
                      onClick={() => removeFile(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {initialData && selectedFiles.length === 0 && (
              <div className="keep-current-file">
                <span className="selected-filename">Mantendo arquivos da versão anterior</span>
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Seletores de Aprovadores e Setores */}
        <div className="form-approval-info">
          <div className="form-group">
            <label>Selecionar Aprovadores (Obrigatório)</label>
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
              {availableApprovers.length === 0 && <p className="empty-info">Carregando gestores...</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Disponibilizar para Setores</label>
            <div className="multi-select-box sectors-grid">
              {AVAILABLE_SECTORS.map(s => (
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
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={isUploading}>
          Cancelar
        </button>
        <button type="submit" className="btn-submit" disabled={isUploading || (selectedFiles.length === 0 && !initialData)}>
          {isUploading ? 'Processando...' : initialData ? 'Criar Nova Versão' : 'Enviar para Aprovação'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;

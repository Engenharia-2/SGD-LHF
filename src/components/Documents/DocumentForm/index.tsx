import React, { useState, useRef, useEffect } from 'react';
import type { User, Document } from '../../../types';
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
  // Lógica de incremento automático de versão
  const getNextVersion = (v: string) => {
    if (!v) return '1.0';
    const parts = v.split('.');
    if (parts.length === 2 && !isNaN(Number(parts[1]))) {
      return `${parts[0]}.${Number(parts[1]) + 1}`;
    }
    return v;
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [version, setVersion] = useState(initialData ? getNextVersion(initialData.version) : '1.0');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [approverIds, setApproverIds] = useState<number[]>([]);
  const [targetSectors, setTargetSectors] = useState<string[]>(initialData?.sector ? [initialData.sector] : [user.sector]);
  const [availableApprovers, setAvailableApprovers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Buscar gestores e admins para a lista de aprovadores
    fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('sgd_token')}` }
    })
    .then(res => res.json())
    .then(data => {
      const approvers = data.filter((u: User) => 
        (u.role === 'Gestor' || u.role === 'Administrador') && u.id !== user.id
      );
      setAvailableApprovers(approvers);
    })
    .catch(err => console.error('Erro ao buscar aprovadores:', err));
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.split('.')[0]);
    }
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
    if (!selectedFile && !initialData) {
      setError('Por favor, selecione um arquivo.');
      return;
    }
    if (approverIds.length === 0) {
      setError('Selecione pelo menos um aprovador.');
      return;
    }

    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);
    formData.append('title', title);
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
        <div className="form-main-info">
          <div className="form-group">
            <label>Título do Documento</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Instrução de Trabalho"
              required
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
            <label>Documento (Arquivo)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                onChange={handleFileChange}
              />
              <button 
                type="button"
                className="btn-select-file"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
              </button>
              {selectedFile ? (
                <span className="selected-filename">{selectedFile.name}</span>
              ) : initialData ? (
                <span className="selected-filename">Mantendo: {initialData.original_name}</span>
              ) : null}
            </div>
          </div>
        </div>

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
        <button type="submit" className="btn-submit" disabled={isUploading}>
          {isUploading ? 'Processando...' : initialData ? 'Criar Nova Versão' : 'Enviar para Aprovação'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;

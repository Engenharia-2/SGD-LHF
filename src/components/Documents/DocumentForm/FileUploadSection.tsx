import React, { useRef } from 'react';
import { Plus, FileText, X } from 'lucide-react';
import type { Document } from '../../../types';

interface FileUploadSectionProps {
  initialData?: Document;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  title: string;
  setTitle: (title: string) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  initialData,
  selectedFiles,
  setSelectedFiles,
  title,
  setTitle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};

export default FileUploadSection;

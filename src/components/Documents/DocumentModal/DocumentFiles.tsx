import React from 'react';
import { Layers, FileText } from 'lucide-react';
import type { Document } from '../../../types';
import { formatSize } from '../../../utils/formatters';

interface DocumentFilesProps {
  document: Document;
}

const DocumentFiles: React.FC<DocumentFilesProps> = ({ document }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <section className="document-files-section">
      <h4><Layers size={18} /> Arquivos do Registro</h4>
      <div className="files-list-container">
        {document.files && document.files.length > 0 ? (
          document.files.map((file) => (
            <div key={file.id} className="file-item-preview">
              <FileText size={20} className="file-icon" />
              <div className="file-info-preview">
                <span className="file-name" title={file.original_name}>{file.original_name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
              <a 
                href={`${API_URL}/uploads/${file.filename}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-view-file"
              >
                Visualizar
              </a>
            </div>
          ))
        ) : (
          <div className="single-file-preview">
            <FileText size={20} />
            <span>{document.original_name || 'Nenhum arquivo disponível'}</span>
            {document.filename && (
              <a 
                href={`${API_URL}/uploads/${document.filename}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-download-preview"
              >
                Visualizar
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentFiles;

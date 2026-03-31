import React from 'react';
import './styles.css';
import type { Document } from '../../../types';
import { useAddDocument } from '../../../hooks/useAddDocument';
import type { DocumentCategory } from '../../../hooks/useAddDocument';
import { useAlert } from '../../../contexts/AlertContext';
import DocumentForm from '../DocumentForm';

interface AddDocumentProps {
  onDocumentAdded?: (newDoc: Document) => void;
  user: {
    id: number;
    username: string;
    sector: string;
    role: string;
  };
  category: DocumentCategory;
}

const AddDocument: React.FC<AddDocumentProps> = ({ onDocumentAdded, user, category }) => {
  const { showAlert } = useAlert();

  const {
    isUploading,
    showModal,
    handleOpenModal,
    handleCloseModal,
    uploadWithData,
  } = useAddDocument(user, category, onDocumentAdded);

  const canAdd = user.role === 'Administrador' || user.role === 'Gestor';

  if (!canAdd) {
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      await uploadWithData(formData);
      showAlert('Documento enviado para aprovação!', 'success');
      handleCloseModal();
    } catch (err: any) {
      showAlert(err.message || 'Erro ao adicionar documento.', 'error');
    }
  };

  // Nome amigável para exibição
  const displayCategory = category.charAt(0) + category.slice(1).toLowerCase();

  return (
    <div className="add-document-wrapper">
      <button className="btn-open-add-modal" onClick={handleOpenModal}>
        <span className="icon">+</span> Adicionar {displayCategory}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3>Novo Registro - {displayCategory}</h3>
              <button className="btn-close" onClick={handleCloseModal}>&times;</button>
            </div>

            <DocumentForm 
              user={user}
              category={category}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              isUploading={isUploading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDocument;

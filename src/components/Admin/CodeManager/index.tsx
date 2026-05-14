import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useCodeManager } from '../../../hooks/useCodeManager';
import type { DocumentCode } from '../../../services/codeService';
import ConfirmModal from '../../Layout/ConfirmModal';
import './styles.css';

const CodeManager: React.FC = () => {
  const { codes, loading, createCode, updateCode, deleteCode } = useCodeManager();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<DocumentCode | null>(null);
  
  const [prefix, setPrefix] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  const availablePages = ['ATAS', 'FORMULARIOS', 'RELATORIOS', 'NORMAS'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPages.length === 0) {
      alert('Selecione pelo menos uma página.');
      return;
    }

    let success = false;
    if (editingCode) {
      success = await updateCode(editingCode.id, prefix, description, selectedPages);
    } else {
      success = await createCode(prefix, description, selectedPages);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPrefix('');
    setDescription('');
    setSelectedPages([]);
    setEditingCode(null);
  };

  const handleEdit = (code: DocumentCode) => {
    setEditingCode(code);
    setPrefix(code.prefix);
    setDescription(code.description);
    // Garantir que code.pages seja tratado como array (vindo do JSON do banco)
    const pages = Array.isArray(code.pages) ? code.pages : JSON.parse(code.pages as string);
    setSelectedPages(pages);
    setShowModal(true);
  };

  const handlePageToggle = (page: string) => {
    setSelectedPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page) 
        : [...prev, page]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === availablePages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(availablePages);
    }
  };

  const handleDeleteItem = (id: number) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.id !== null) {
      await deleteCode(confirmDelete.id);
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  if (loading) return <div className="loading-placeholder">Carregando gerenciador de códigos...</div>;

  return (
    <div className="code-manager-section">
      <div className="section-header">
        <h3>Gerenciamento de Códigos de Registro</h3>
        <button className="btn-add-code" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Código
        </button>
      </div>

      <div className="code-list-container">
        <table className="code-table">
          <thead>
            <tr>
              <th>Prefixo</th>
              <th>Descrição (Significado)</th>
              <th>Páginas Aplicáveis</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-row">Nenhum código cadastrado.</td>
              </tr>
            ) : (
              codes.map(code => {
                const pages = Array.isArray(code.pages) ? code.pages : JSON.parse(code.pages as string);
                return (
                  <tr key={code.id}>
                    <td className="code-prefix"><strong>{code.prefix}</strong></td>
                    <td>{code.description}</td>
                    <td>
                      <div className="pages-badges">
                        {pages.map((p: string) => (
                          <span key={p} className="badge-sector">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEdit(code)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteItem(code.id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="modal-header">
              <h4>{editingCode ? 'Editar Código' : 'Cadastrar Novo Código'}</h4>
              <button onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Prefixo (Sigla)</label>
                <input 
                  type="text" 
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  placeholder="Ex: TTT"
                  maxLength={10}
                  required
                />
                <small>Máximo 10 caracteres. Ex: SOP, PQS, ATA.</small>
              </div>
              <div className="form-group">
                <label>Descrição (Significado)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Treinamento de Testes do Trabalhador"
                  required
                />
              </div>
              <div className="form-group">
                <label>Páginas de Aplicação</label>
                <div className="checkbox-group">
                  {availablePages.map(page => (
                    <label key={page} className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={selectedPages.includes(page)}
                        onChange={() => handlePageToggle(page)}
                      />
                      {page.charAt(0) + page.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
                <div className="select-all-container">
                  <label className="checkbox-label select-all">
                    <input 
                      type="checkbox"
                      checked={selectedPages.length === availablePages.length}
                      onChange={handleSelectAll}
                    />
                    Selecionar Todas as Páginas
                  </label>
                </div>
                <small>O código aparecerá apenas na criação de documentos nas páginas selecionadas.</small>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-save">
                  {editingCode ? <Check size={18} /> : <Plus size={18} />}
                  {editingCode ? 'Salvar Alterações' : 'Cadastrar Código'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Excluir Código"
        message="Tem certeza que deseja excluir este código de registro? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
        type="danger"
      />
    </div>
  );
};

export default CodeManager;

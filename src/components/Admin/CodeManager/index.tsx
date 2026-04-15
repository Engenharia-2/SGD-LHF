import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useCodeManager } from '../../../hooks/useCodeManager';
import type { DocumentCode } from '../../../services/codeService';
import './styles.css';

const CodeManager: React.FC = () => {
  const { codes, loading, createCode, updateCode, deleteCode } = useCodeManager();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<DocumentCode | null>(null);
  
  const [prefix, setPrefix] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (editingCode) {
      success = await updateCode(editingCode.id, prefix, description);
    } else {
      success = await createCode(prefix, description);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPrefix('');
    setDescription('');
    setEditingCode(null);
  };

  const handleEdit = (code: DocumentCode) => {
    setEditingCode(code);
    setPrefix(code.prefix);
    setDescription(code.description);
    setShowModal(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este código?')) {
      await deleteCode(id);
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-row">Nenhum código cadastrado.</td>
              </tr>
            ) : (
              codes.map(code => (
                <tr key={code.id}>
                  <td className="code-prefix"><strong>{code.prefix}</strong></td>
                  <td>{code.description}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(code)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteItem(code.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
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
    </div>
  );
};

export default CodeManager;

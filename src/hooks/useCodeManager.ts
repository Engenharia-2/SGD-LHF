import { useState, useEffect, useCallback } from 'react';
import { codeService } from '../services/codeService';
import type { DocumentCode } from '../services/codeService';
import { useAlert } from '../contexts/AlertContext';

/**
 * Hook personalizado para gerenciar a lógica de códigos de registro.
 * Centraliza busca, criação, edição e exclusão de prefixos.
 */
export const useCodeManager = () => {
  const [codes, setCodes] = useState<DocumentCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchCodes = useCallback(async () => {
    try {
      const data = await codeService.list();
      setCodes(data);
    } catch (err: any) {
      console.error(err.message);
      showAlert(err.message || 'Erro ao carregar códigos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = async (prefix: string, description: string) => {
    try {
      await codeService.create(prefix, description);
      showAlert('Código criado com sucesso!', 'success');
      await fetchCodes();
      return true;
    } catch (err: any) {
      showAlert(err.message || 'Erro ao criar código', 'error');
      return false;
    }
  };

  const updateCode = async (id: number, prefix: string, description: string) => {
    try {
      await codeService.update(id, prefix, description);
      showAlert('Código atualizado com sucesso!', 'success');
      await fetchCodes();
      return true;
    } catch (err: any) {
      showAlert(err.message || 'Erro ao atualizar código', 'error');
      return false;
    }
  };

  const deleteCode = async (id: number) => {
    try {
      await codeService.delete(id);
      showAlert('Código excluído com sucesso!', 'success');
      await fetchCodes();
      return true;
    } catch (err: any) {
      showAlert(err.message || 'Erro ao excluir código', 'error');
      return false;
    }
  };

  return {
    codes,
    loading,
    fetchCodes,
    createCode,
    updateCode,
    deleteCode
  };
};

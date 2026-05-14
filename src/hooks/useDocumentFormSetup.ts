import { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { codeService } from '../services/codeService';
import type { DocumentCode } from '../services/codeService';
import type { User, Document } from '../types';

interface UseDocumentFormSetupProps {
  userId: number;
  category: string;
  isRelatorio: boolean;
  isAtas: boolean;
  initialData?: Document;
  currentDocCode: string;
  setDocCode: (code: string) => void;
}

export const useDocumentFormSetup = ({
  userId,
  category,
  isRelatorio,
  isAtas,
  initialData,
  currentDocCode,
  setDocCode
}: UseDocumentFormSetupProps) => {
  const [availableCodes, setAvailableCodes] = useState<DocumentCode[]>([]);
  const [availableApprovers, setAvailableApprovers] = useState<User[]>([]);
  const [availableReaders, setAvailableReaders] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [approversResponse, usersGlobalResponse, codesResponse] = await Promise.allSettled([
          documentService.getAvailableApprovers(),
          documentService.listAllUsersGlobal(),
          codeService.list(category)
        ]);

        if (!isMounted) return;

        // Process Approvers
        if (approversResponse.status === 'fulfilled') {
          const others = approversResponse.value.filter((u: User) => u.id !== userId);
          if (!isRelatorio) {
            setAvailableApprovers(others);
          }
        } else {
          console.error('Erro ao buscar aprovadores:', approversResponse.reason);
          // Omitindo setError aqui para não bloquear o resto da tela se apenas isso falhar,
          // mas em um cenário real mais restrito, poderíamos lançar um erro global.
        }

        // Process Global Users
        if (usersGlobalResponse.status === 'fulfilled') {
          const others = usersGlobalResponse.value.filter((u: User) => u.id !== userId);
          if (isRelatorio) {
            setAvailableApprovers(others);
          }
          if (isAtas) {
            setAvailableReaders(others);
          }
        } else {
          console.error('Erro ao buscar usuários globais:', usersGlobalResponse.reason);
        }

        // Process Codes
        if (codesResponse.status === 'fulfilled') {
          const codes = codesResponse.value;
          setAvailableCodes(codes);
          
          if (!initialData && codes.length > 0 && !currentDocCode) {
            setDocCode(codes[0].prefix);
          }
        } else {
          console.error('Erro ao buscar códigos:', codesResponse.reason);
          setError('Não foi possível carregar os códigos de registro. Verifique a conexão.');
        }

      } catch (err) {
        if (isMounted) {
          setError('Ocorreu um erro crítico ao carregar as dependências do formulário.');
          console.error('Erro geral de setup do formulário:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId, isRelatorio, isAtas, initialData, currentDocCode, setDocCode]);

  return {
    availableCodes,
    availableApprovers,
    availableReaders,
    isLoading,
    error
  };
};

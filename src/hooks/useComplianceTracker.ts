import { useState, useEffect, useCallback } from 'react';
import { readingService } from '../services/readingService';
import { documentService } from '../services/documentService';
import type { Document, Collaborator, ComplianceItem, NormCompliance } from '../types';

export const useComplianceTracker = () => {
  const [viewMode, setViewMode] = useState<'user' | 'norm'>('user');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [norms, setNorms] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<Collaborator | null>(null);
  const [userCompliance, setUserCompliance] = useState<ComplianceItem[]>([]);
  
  const [selectedNorm, setSelectedNorm] = useState<Document | null>(null);
  const [normCompliance, setNormCompliance] = useState<NormCompliance[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, normsData] = await Promise.all([
          readingService.listCollaborators(),
          documentService.listByFilters({})
        ]);
        setCollaborators(usersData);
        setNorms(normsData);
      } catch (err) {
        console.error('Erro ao carregar dados de conformidade:', err);
      }
    };
    fetchData();
  }, []);

  const handleUserSelect = useCallback(async (user: Collaborator) => {
    setSelectedUser(user);
    setSelectedNorm(null);
    setLoading(true);
    try {
      const data = await readingService.getUserCompliance(user.id);
      setUserCompliance(data);
    } catch (err) {
      console.error('Erro ao buscar conformidade do usuário:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNormSelect = useCallback(async (norm: Document) => {
    setSelectedNorm(norm);
    setSelectedUser(null);
    setLoading(true);
    try {
      const data = await readingService.getNormCompliance(norm.id);
      setNormCompliance(data);
    } catch (err) {
      console.error('Erro ao buscar conformidade da norma:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleViewMode = (mode: 'user' | 'norm') => {
    setViewMode(mode);
    setSearchTerm('');
    // Limpar seleções ao trocar de modo para evitar estados inconsistentes na UI
    setSelectedUser(null);
    setSelectedNorm(null);
  };

  const filteredCollaborators = collaborators.filter(c => 
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNorms = norms.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.doc_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    viewMode,
    searchTerm,
    setSearchTerm,
    toggleViewMode,
    selectedUser,
    userCompliance,
    selectedNorm,
    normCompliance,
    loading,
    handleUserSelect,
    handleNormSelect,
    filteredCollaborators,
    filteredNorms
  };
};

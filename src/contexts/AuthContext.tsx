import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { ROLES } from '../utils/constants';
interface AuthContextType {
  user: User | null;
  activeSector: string;
  login: (userData: User, token: string) => void;
  logout: () => void;
  changeSector: (sector: string) => void;
  canChangeSector: boolean;
  canModify: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSector, setActiveSector] = useState<string>('Geral');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('sgd_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setActiveSector(parsedUser.sector);
      }
    } catch (error) {
      console.error('Falha ao restaurar usuário do cache. Limpando credenciais corrompidas.', error);
      localStorage.removeItem('sgd_user');
      localStorage.removeItem('sgd_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setActiveSector(userData.sector);
    localStorage.setItem('sgd_user', JSON.stringify(userData));
    localStorage.setItem('sgd_token', token);
  };

  const logout = () => {
    console.log('AuthContext: Executando logout');
    setUser(null);
    localStorage.removeItem('sgd_user');
    localStorage.removeItem('sgd_token');
    // window.location.reload() removido: A árvore do React desmontará os componentes protegidos nativamente.
  };

  const changeSector = (sector: string) => {
    // Apenas Gestores podem mudar o setor ativo
    if (user?.role === ROLES.GESTOR) {
      setActiveSector(sector);
    }
  };

  const canChangeSector = user?.role === ROLES.GESTOR;
  const canModify = user?.role === ROLES.GESTOR || user?.role === ROLES.ADMIN;

  return (
    <AuthContext.Provider value={{ 
      user, 
      activeSector, 
      login, 
      logout, 
      changeSector, 
      canChangeSector, 
      canModify,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

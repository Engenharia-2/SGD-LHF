import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

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
    const savedUser = localStorage.getItem('sgd_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setActiveSector(parsedUser.sector);
    }
    setIsLoading(false);
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
    window.location.reload(); // Forçar reload para limpar estados de outros contexts
  };

  const changeSector = (sector: string) => {
    // Apenas Gestores podem mudar o setor ativo
    if (user?.role === 'Gestor') {
      setActiveSector(sector);
    }
  };

  const canChangeSector = user?.role === 'Gestor';
  const canModify = user?.role === 'Gestor' || user?.role === 'Administrador';

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

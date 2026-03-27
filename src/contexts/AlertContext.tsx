import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Alert from '../components/Layout/Alert';
import type { AlertType } from '../components/Layout/Alert';

interface AlertContextData {
  showAlert: (message: string, type?: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextData>({} as AlertContextData);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType;
  } | null>(null);

  const showAlert = useCallback((message: string, type: AlertType = 'info') => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={hideAlert} 
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
};

'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

interface ErrorDialogState {
  message: string;
  type?: 'error' | 'success' | 'info';
}

interface ErrorDialogContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  hideError: () => void;
}

const ErrorDialogContext = createContext<ErrorDialogContextValue | null>(null);

export function useErrorDialog() {
  const context = useContext(ErrorDialogContext);
  
  if (!context) {
    throw new Error('useErrorDialog must be used within an ErrorDialogProvider');
  }
  
  return context;
}

interface ErrorDialogProviderProps {
  children: React.ReactNode;
}

export function ErrorDialogProvider({ children }: ErrorDialogProviderProps) {
  const [state, setState] = useState<ErrorDialogState>({
    message: '',
    type: 'error',
  });

  const showError = useCallback((message: string) => {
    setState({
      message,
      type: 'error',
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setState({
      message,
      type: 'success',
    });
  }, []);

  const hideError = useCallback(() => {
    setState((prev) => ({ ...prev, message: '' }));
  }, []);

  return (
    <ErrorDialogContext.Provider value={{ showError, showSuccess, hideError }}>
      {children}
      {state.message && (
        <Toast
          message={state.message}
          type={state.type || 'error'}
          onClose={hideError}
        />
      )}
    </ErrorDialogContext.Provider>
  );
}

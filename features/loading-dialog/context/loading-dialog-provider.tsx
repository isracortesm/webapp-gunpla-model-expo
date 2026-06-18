'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import LoadingDialog from './../../../components/ui/dialogs/LoadingDialog';
import '@/components/ui/dialogs/LoadingDialog.css';

interface LoadingDialogState {
  message: string;
}

interface LoadingDialogContextValue {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingDialogContext = createContext<LoadingDialogContextValue | null>(null);

export function useLoadingDialog() {
  const context = useContext(LoadingDialogContext);

  if (!context) {
    throw new Error('useLoadingDialog must be used within a LoadingDialogProvider');
  }

  return context;
}

interface LoadingDialogProviderProps {
  children: React.ReactNode;
}

export function LoadingDialogProvider({ children }: LoadingDialogProviderProps) {
  const [state, setState] = useState<LoadingDialogState>({
    message: 'Loading...',
  });

  const showLoading = useCallback((message?: string) => {
    setState({
      message: message || 'Loading...',
    });
  }, []);

  const hideLoading = useCallback(() => {
    setState({
      message: 'Loading...',
    });
  }, []);

  return (
    <LoadingDialogContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingDialog isOpen={!!state.message} message={state.message || undefined} />
    </LoadingDialogContext.Provider>
  );
}

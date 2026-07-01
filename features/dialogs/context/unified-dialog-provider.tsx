'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import LoadingDialog from '@/components/ui/dialogs/LoadingDialog';
import ErrorDialog from '@/components/ui/dialogs/ErrorDialog';
import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog';
import '@/components/ui/dialogs/LoadingDialog.css';
import '@/components/ui/dialogs/ErrorDialog.css';

// ==================== Loading State ====================
interface LoadingState {
  message: string;
}

// ==================== Message State (Error/Success) ====================
type MessageType = 'error' | 'success' | 'info';

interface MessageState {
  type: MessageType;
  title?: string;
  message: string;
}

// ==================== Confirmation State ====================
interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ==================== Context Value Interface ====================
interface UnifiedDialogContextValue {
  // Loading methods
  showLoading: (message?: string) => void;
  hideLoading: () => void;

  // Message methods
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showMessage: (type: MessageType, message: string, title?: string) => void;
  hideMessage: () => void;

  // Confirmation methods
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
  ) => void;
}

const UnifiedDialogContext = createContext<UnifiedDialogContextValue | null>(null);

export function useUnifiedDialog() {
  const context = useContext(UnifiedDialogContext);

  if (!context) {
    throw new Error('useUnifiedDialog must be used within a UnifiedDialogProvider');
  }

  return context;
}

// ==================== Provider Component ====================
interface UnifiedDialogProviderProps {
  children: React.ReactNode;
}

export function UnifiedDialogProvider({ children }: UnifiedDialogProviderProps) {
  // Loading state
  const [loadingState, setLoadingState] = useState<LoadingState>({ message: '' });

  // Message state (error/success/info)
  const [messageState, setMessageState] = useState<MessageState | null>(null);

  // Confirmation state
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    isOpen: false,
    title: 'Confirmacion',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Loading methods
  const showLoading = useCallback((message?: string) => {
    setLoadingState({ message: message || 'Cargando...' });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({ message: '' });
  }, []);

  // Message methods
  const showError = useCallback((message: string, title?: string) => {
    setMessageState({ type: 'error', title: title || 'Error', message });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    setMessageState({ type: 'success', title: title || 'Success', message });
  }, []);

  const showMessage = useCallback(
    (type: MessageType, message: string, title?: string) => {
      setMessageState({ type, title: title || '', message });
    },
    [],
  );

  const hideMessage = useCallback(() => {
    setMessageState(null);
  }, []);

  // Confirmation methods
  const showConfirmation = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      confirmText?: string,
      cancelText?: string,
    ) => {
      setConfirmationState({
        isOpen: true,
        title,
        message,
        confirmText: confirmText || 'Confirmar',
        cancelText: cancelText || 'Cancelar',
        onConfirm,
        onCancel: onCancel || (() => {}),
      });
    },
    [],
  );

  return (
    <UnifiedDialogContext.Provider
      value={{
        showLoading,
        hideLoading,
        showError,
        showSuccess,
        showMessage,
        hideMessage,
        showConfirmation,
      }}>
      {children}

      {/* Loading Dialog */}
      <LoadingDialog isOpen={!!loadingState.message} message={loadingState.message || undefined} />

      {/* Error/Success Message Dialog */}
      {messageState && (
        <ErrorDialog
          isOpen={true}
          title={messageState.title}
          message={messageState.message}
          type={messageState.type}
          onClose={hideMessage}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        onConfirm={() => {
          confirmationState.onConfirm();
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => {
          confirmationState.onCancel();
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </UnifiedDialogContext.Provider>
  );
}

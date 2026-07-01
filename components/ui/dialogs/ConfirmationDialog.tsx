'use client';

import { useEffect } from 'react';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title = 'Confirmacion',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog-overlay" onClick={onCancel}>
      <div className="confirmation-dialog-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="confirmation-dialog-title">{title}</h1>
        <p className="confirmation-dialog-message">{message}</p>
        <div className="confirmation-dialog-buttons">
          <button className="confirmation-dialog-button cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirmation-dialog-button confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

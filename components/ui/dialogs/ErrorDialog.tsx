'use client';

import { useEffect } from 'react';
import './ErrorDialog.css';

type MessageType = 'error' | 'success' | 'info';

interface ErrorDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: MessageType;
  onClose: () => void;
}

export default function ErrorDialog({
  isOpen,
  title = 'Error',
  message,
  type = 'error',
  onClose,
}: ErrorDialogProps) {
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
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="error-dialog-overlay" onClick={onClose}>
      <div className="error-dialog-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="error-dialog-title">{title}</h1>
        <p className="error-dialog-message">{message}</p>
        <button className="error-dialog-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

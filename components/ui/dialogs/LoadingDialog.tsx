'use client';

import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/loader.json';
import './LoadingDialog.css';

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
}

export default function LoadingDialog({ isOpen, message = 'Loading...' }: LoadingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="loading-dialog-overlay">
      <div className="loading-dialog-content">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{ width: '250px', height: '150px' }}
        />
        {message && <p className="loading-dialog-message">{message}</p>}
      </div>
    </div>
  );
}

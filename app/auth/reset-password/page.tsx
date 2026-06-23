'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import '@/app/auth/reset-password/reset-password.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(() => searchParams.get('code') || '');

async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    try {
      showLoading('Resetting password...');
      await resetPasswordUser(password, confirmPassword, verificationCode);
      router.push('/auth/reset-password/success/');
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err) {
        showError(err.message);
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('An unexpected error occurred.');
      }
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="register-page">
      <button
          onClick={() => router.back()}
          className="reset-page__back-btn">
          Back
      </button>
      <h1 className="reset-page__title">Reset Password</h1>

      <form onSubmit={handleSubmit} className="register-form">

        <label htmlFor="verificationCode" className="input-label">Verification Code</label>
        <input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          placeholder="Enter verification code sent via email"
          className="text-input no-autofill"
        />

        <label htmlFor="password" className="input-label">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter new password"
          className="password-input no-autofill"
        />

        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm new password"
          className="password-input no-autofill"
        />

        <button
          type="submit"
          disabled={!verificationCode || !password || !confirmPassword}
          className="register-button">
          Reset Password
        </button>

        <p className="login-link-text">
          Remembered your password?{' '}
          <a href="/auth/login" className="login-link">Login</a>
        </p>
      </form>
    </div>
  );
}
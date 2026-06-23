'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import '@/app/auth/forgot-password/forgot-password.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [email, setEmail] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Sending reset code...');
      await forgotPasswordUser(email);
      router.push('/auth/forgot-password/success');
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
          className="forgot-page__back-btn">
          Back
      </button>
      <h1 className="forgot-page__title">Forgot Password</h1>

      <form onSubmit={handleSubmit} className="register-form">

          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="text-input no-autofill"
          />

          <button
            type="submit"
            disabled={!email}
            className="register-button">
            Send Reset Code
          </button>

          <p className="login-link-text">
            Remembered your password?{' '}
            <a href="/auth/login" className="login-link">Login</a>
          </p>
        </form>
    </div>
  );
}
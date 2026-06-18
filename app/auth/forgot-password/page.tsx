'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import '@/app/auth/register/register.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Sending reset code...');
      await forgotPasswordUser(email);
      setSent(true);
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
      {!sent ? (
        <form onSubmit={handleSubmit} className="register-form">
          <h1 className="register-title">Forgot Password</h1>

          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="text-input"
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
      ) : (
        <div className="register-form">
          <h1 className="register-title">Reset Code Sent</h1>

          <p style={{ color: 'rgba(0, 0, 0, 0.5)', marginBottom: '24px' }}>
            We've sent a reset code to your email address. Please check your inbox and click the link to reset your password.
          </p>

          <button
            onClick={() => router.push('/auth/login')}
            className="register-button">
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/features/auth/service/auth-service';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import '@/app/auth/login/login.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, fetchCurrentUser } = useAuthWithStorage();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Logging in...');
      const response = await loginUser(identifier, password);
      login(response.user, response.jwt);
      
      // Fetch current user data and keep loader until it completes
      await fetchCurrentUser();
      hideLoading();
      router.push('/');
    } catch (err: unknown) {
      hideLoading();
      if (err instanceof Error && 'status' in err) {
        showError(err.message);
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('An unexpected error occurred.');
      }
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">Login</h1>

        <label htmlFor="identifier" className="input-label">Username or Email</label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          placeholder="Enter username or email"
          className="text-input no-autofill"
        />

        <label htmlFor="password" className="input-label">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
          className="password-input no-autofill"
        />

        <button
          type="submit"
          disabled={!identifier || !password}
          className="login-button">
          Login
        </button>

        <p className="register-link-text">
          Don't have an account?{' '}
          <a href="/auth/register" className="register-link">Register</a>
        </p>

        <a href="/auth/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>
      </form>
    </div>
  );
}
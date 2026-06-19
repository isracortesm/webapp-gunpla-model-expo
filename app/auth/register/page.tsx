'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/features/auth/service/auth-service';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import '@/app/auth/register/register.css';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthWithStorage();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Registering...');
      const response = await registerUser(username, email, password);
      login(response.user);
      router.push('/auth/register/success');
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
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="register-title">Register</h1>

        <label htmlFor="username" className="input-label">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter username"
          className="text-input no-autofill"
        />

        <label htmlFor="email" className="input-label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter email"
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
          disabled={!username || !email || !password}
          className="register-button">
          Register
        </button>

        <p className="login-link-text">
          Already have an account?{' '}
          <a href="/auth/login" className="login-link">Login</a>
        </p>
      </form>
    </div>
  );
}
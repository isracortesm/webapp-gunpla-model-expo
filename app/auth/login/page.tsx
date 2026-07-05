'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, getCurrentUser } from '@/features/auth/service/auth-service';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import PasswordField from '@/components/ui/PasswordField';
import PageHeader from '@/components/ui/PageHeader';
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
      showLoading('Iniciando sesión...');
      const loginRes = await loginUser(identifier, password);
      login(loginRes.jwt);
      
      // Fetch current user data and keep loader until it completes
      const fetchRes = await getCurrentUser();
      fetchCurrentUser(fetchRes)

      hideLoading();
      router.push('/');
    } catch (err: unknown) {
      hideLoading();
      if (err instanceof Error && 'status' in err) {
        showError(err.message);
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('Ocurrió un error inesperado.');
      }
    }
  }

  return (
    <div className="login-page">
      <PageHeader title="Iniciar Sesión" onBack={() => router.back()} position="static" />

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form__card">

        <label htmlFor="identifier" className="input-label">Usuario o Correo</label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          placeholder="Ingresa tu usuario o correo"
          className="text-input no-autofill"
        />

        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
          required
          placeholder="Ingresa tu contraseña"
          className="password-input no-autofill"
          label="Contraseña"
        />

        <button
          type="submit"
          disabled={!identifier || !password}
          className="login-button">
          Iniciar Sesión
        </button>

        <p className="register-link-text">
          ¿No tienes cuenta?{' '}
          <a href="/auth/register" className="register-link">Registrarse</a>
        </p>

        <a href="/auth/forgot-password" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>
        </div>
      </form>
    </div>
  );
}
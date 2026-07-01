'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import PasswordField from '@/components/ui/PasswordField';
import '@/app/auth/register/register.css';

export default function RegisterPage() {
  const router = useRouter();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Registrando...');
      await registerUser(username, email, password);
      router.push('/auth/register/success');
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err) {
        showError(err.message);
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('Ocurrió un error inesperado.');
      }
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="register-page">
      <button
          onClick={() => router.back()}
          className="register-page__back-btn">
          Volver
      </button>
      <h1 className="register-page__title">Registrarse</h1>

      <form onSubmit={handleSubmit} className="register-form">

        <label htmlFor="username" className="input-label">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Ingresa tu nombre de usuario"
          className="text-input no-autofill"
        />

        <label htmlFor="email" className="input-label">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Ingresa tu correo"
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
          disabled={!username || !email || !password}
          className="register-button">
          Registrarse
        </button>

        <p className="login-link-text">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="login-link">Iniciar Sesión</a>
        </p>
      </form>
    </div>
  );
}
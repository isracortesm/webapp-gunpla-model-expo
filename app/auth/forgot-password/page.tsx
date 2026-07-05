'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import PageHeader from '@/components/ui/PageHeader';
import '@/app/auth/forgot-password/forgot-password.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();
  
  const [email, setEmail] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      showLoading('Enviando código de recuperación...');
      await forgotPasswordUser(email);
      router.push('/auth/forgot-password/success');
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
    <div className="forgot-page">
      <PageHeader title="Recuperar Contraseña" onBack={() => router.back()} position="static" />

      <form onSubmit={handleSubmit} className="forgot-form">
        <div className="forgot-form__card">

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

          <button
            type="submit"
            disabled={!email}
            className="forgot-button">
            Enviar Código
          </button>

          <p className="login-link-text">
            ¿Recordaste tu contraseña?{' '}
            <a href="/auth/login" className="login-link">Iniciar Sesión</a>
          </p>
        </div>
      </form>
    </div>
  );
}
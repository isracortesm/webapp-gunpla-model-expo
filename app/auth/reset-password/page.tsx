'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import PasswordField from '@/components/ui/PasswordField';
import PageHeader from '@/components/ui/PageHeader';
import '@/app/auth/reset-password/reset-password.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showLoading, hideLoading } = useUnifiedDialog();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(() => searchParams.get('code') || '');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden.');
      return;
    }
    try {
      showLoading('Restableciendo contraseña...');
      await resetPasswordUser(password, confirmPassword, verificationCode);
      router.push('/auth/reset-password/success/');
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
    <div className="reset-page">
      <PageHeader title="Restablecer Contraseña" onBack={() => router.back()} position="static" />

      <form onSubmit={handleSubmit} className="reset-form">
        <div className="reset-form__card">

        <label htmlFor="verificationCode" className="input-label">Código de verificación</label>
        <input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          placeholder="Ingresa el código enviado a tu correo"
          className="text-input no-autofill"
        />

        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
          required
          placeholder="Ingresa tu nueva contraseña"
          className="password-input no-autofill"
          label="Nueva Contraseña"
        />

        <PasswordField
          id="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          placeholder="Confirma tu nueva contraseña"
          className="password-input no-autofill"
          label="Confirmar Contraseña"
        />

        <button
          type="submit"
          disabled={!verificationCode || !password || !confirmPassword}
          className="reset-button">
          Restablecer Contraseña
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="reset-page">
        <PageHeader title="Restablecer Contraseña" position="static" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
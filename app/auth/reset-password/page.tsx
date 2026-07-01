'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordUser } from '@/features/auth/service/auth-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import PasswordField from '@/components/ui/PasswordField';
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
    <div className="register-page">
      <button
          onClick={() => router.back()}
          className="reset-page__back-btn">
          Volver
      </button>
      <h1 className="reset-page__title">Restablecer Contraseña</h1>

      <form onSubmit={handleSubmit} className="register-form">

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
          className="register-button">
          Restablecer Contraseña
        </button>

        <p className="login-link-text">
          ¿Recordaste tu contraseña?{' '}
          <a href="/auth/login" className="login-link">Iniciar Sesión</a>
        </p>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="register-page">
        <h1 className="reset-page__title">Restablecer Contraseña</h1>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
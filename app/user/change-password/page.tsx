'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { changePassword } from '@/features/auth/service/auth-service';
import './change-password.css';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { showLoading, hideLoading, showError, showSuccess, showConfirmation } = useUnifiedDialog();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      showError('Las contraseñas no coinciden', 'Error');
      return;
    }

    showConfirmation(
      'Cambiar Contraseña',
      '¿Estás seguro de que deseas cambiar tu contraseña?',
      async () => {
        setIsSubmitting(true);
        showLoading('Cambiando contraseña...');
        try {
          const response = await changePassword(currentPassword, password, passwordConfirmation);
          localStorage.setItem('auth_token', response.jwt);
          localStorage.setItem('auth_user', JSON.stringify(response.user));
          showSuccess('Contraseña cambiada correctamente');
          router.back();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
          showError(message, 'Error');
        } finally {
          hideLoading();
          setIsSubmitting(false);
        }
      },
    );
  }

  return (
    <main className="change-password-page__container">
      <button
        onClick={() => router.back()}
        className="change-password-page__back-btn">
        Volver
      </button>
      <h1 className="change-password-page__title">Cambiar Contraseña</h1>
      <div className="change-password-page__card-wrapper">
        <form onSubmit={handleSubmit} className="change-password-form">
          <label className="input-label">Contraseña Actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Ingresa tu contraseña actual"
            className="text-input"/>

          <label className="input-label">Nueva Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingresa tu nueva contraseña"
            className="text-input"/>

          <label className="input-label">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Confirma tu nueva contraseña"
            className="text-input"/>

          <button
            type="submit"
            disabled={!currentPassword || !password || !passwordConfirmation || isSubmitting}
            className="submit-btn">
            {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </main>
  );
}

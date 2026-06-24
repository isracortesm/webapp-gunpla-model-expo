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
      showError('Passwords do not match', 'Error');
      return;
    }

    showConfirmation(
      'Change Password',
      'Are you sure you want to change your password?',
      async () => {
        setIsSubmitting(true);
        showLoading('Changing password...');
        try {
          const response = await changePassword(currentPassword, password, passwordConfirmation);
          localStorage.setItem('auth_token', response.jwt);
          localStorage.setItem('auth_user', JSON.stringify(response.user));
          showSuccess('Password changed successfully');
          router.back();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to change password';
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
        className="change-password-page__back-btn"
      >
        Back
      </button>
      <h1 className="change-password-page__title">Change Password</h1>
      <div className="change-password-page__card-wrapper">
        <form onSubmit={handleSubmit} className="change-password-form">
          <label className="input-label">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
            className="text-input"
          />

          <label className="input-label">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter new password"
            className="text-input"
          />

          <label className="input-label">Confirm New Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Confirm new password"
            className="text-input"
          />

          <button
            type="submit"
            disabled={!currentPassword || !password || !passwordConfirmation || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </main>
  );
}

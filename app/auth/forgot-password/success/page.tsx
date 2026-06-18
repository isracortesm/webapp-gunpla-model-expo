'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/auth/forgot-password/success/success.css';

export default function ForgotPasswordSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/auth/reset-password');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="success-page">
      <div className="success-container">
        <h1>Code Sent Successfully!</h1>
        <p>A verification code has been sent to your email address.</p>
        <p>You will be redirected to the reset password page in {countdown} seconds...</p>
        <button onClick={() => router.push('/auth/reset-password')}>Go to Reset Password</button>
      </div>
    </div>
  );
}

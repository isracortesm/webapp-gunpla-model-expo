'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/css/success-screen.css';

export default function ResetPasswordSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/auth/login');
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
        <h1>Password Reset Successful!</h1>
        <p>Your password has been changed successfully.</p>
        <p>You will be redirected to the login page in {countdown} seconds...</p>
        <button onClick={() => router.push('/auth/login')}>Go to Login</button>
      </div>
    </div>
  );
}

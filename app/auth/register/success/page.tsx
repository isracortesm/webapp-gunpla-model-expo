'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/css/success-screen.css';

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
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
        <h1>Registration Successful!</h1>
        <p>Your account has been created successfully.</p>
        <p>You will be redirected to the home page in {countdown} seconds...</p>
        <button onClick={() => router.push('/')}>Go to Home</button>
      </div>
    </div>
  );
}

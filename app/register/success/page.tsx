'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/register/success/success.css';

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
  }, [countdown, router]);

  function handleBack() {
    router.push('/');
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <h1 className="success-title">Registration Successful!</h1>
        
        <p className="success-message">
          Your account has been created successfully. Please confirm your email address to complete the registration process.
        </p>

        <button onClick={handleBack} className="back-button">
          Back to Home ({countdown}s)
        </button>
      </div>
    </div>
  );
}
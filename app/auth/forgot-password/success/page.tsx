'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/css/success-screen.css';

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
        <h1>Código enviado!</h1>
        <p>Tu código de confirmacion a sido enviado a tu correo registrado.</p>
        <p>Seras redirigido a la pagina de recuperacion de contraseña en {countdown} segundo...</p>
        <button onClick={() => router.push('/auth/reset-password')}>Ir a recuperar contraseña</button>
      </div>
    </div>
  );
}

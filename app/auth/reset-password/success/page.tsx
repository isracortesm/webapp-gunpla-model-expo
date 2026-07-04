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
        <h1>Actualizacion exitosa!</h1>
        <p>Tu contraseña ha sido actualizada exitosamente.</p>
        <p>Seras redirigido a la pagina de Login en {countdown} segundos...</p>
        <button onClick={() => router.push('/auth/login')}>Ir a Login</button>
      </div>
    </div>
  );
}

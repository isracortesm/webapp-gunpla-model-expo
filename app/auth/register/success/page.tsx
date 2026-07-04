'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/css/success-screen.css';

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

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
        <h1>Registro exitoso!</h1>
        <p>Recibiras un correo para confirmar tu cuenta. Por favor revisa tambien tu bandeja de SPAM si no vez el correo.</p>
        <p>Seras redirigido a la pagina de inicio en {countdown} segundos...</p>
        <button onClick={() => router.push('/')}>Ir a inicio</button>
      </div>
    </div>
  );
}

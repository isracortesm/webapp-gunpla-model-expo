'use client';

import { useRouter } from 'next/navigation';
import ModelFormCard from '@/components/ui/cards/ModelFormCard';
import './create.css';

export default function CreateModelPage() {
  const router = useRouter();

  return (
    <main className="create-page__container">
      <button
        onClick={() => router.push('/user/models')}
        className="create-page__back-btn">
        Volver
      </button>
      <h1 className="create-page__title">Nuevo modelo</h1>
      <div className="create-page__card-wrapper">
        <ModelFormCard
          mode="create"
          onSuccess={() => router.push('/user/models')}
          onCancel={() => router.push('/user/models')}
        />
      </div>
    </main>
  );
}

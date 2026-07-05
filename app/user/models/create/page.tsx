'use client';

import { useRouter } from 'next/navigation';
import ModelFormCard from '@/components/ui/cards/ModelFormCard';
import PageHeader from '@/components/ui/PageHeader';
import './create.css';

export default function CreateModelPage() {
  const router = useRouter();

  return (
    <main className="create-page__container">
      <PageHeader title="Nuevo modelo" onBack={() => router.push('/user/models')} position="static" />
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

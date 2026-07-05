'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getNewsByDocumentId } from '@/features/event-dashboard/service/event-dashboard-service';
import type { NewsEntity } from '@/domain/entities/event-dashboard/entity';
import PageHeader from '@/components/ui/PageHeader';
import './detail.css';

export default function NewsDetailPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
  const [news, setNews] = useState<NewsEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function load() {
      showLoading('Cargando noticia...');
      try {
        const data = await getNewsByDocumentId(params.documentId);
        setNews(data);
      } catch {
        showError('Error al cargar la noticia', 'Error');
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }
    load();
  }, [params.documentId, showLoading, hideLoading, showError]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading || !news) return null;

  return (
    <main className="news-detail__container">
      <PageHeader title="" onBack={() => router.back()} />

      <div className="news-detail__card">
        {news.thumbnail?.url && (
          <div className="news-detail__image-container">
            <Image
              src={news.thumbnail.url}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
            <div className="news-detail__gradient-overlay" />
          </div>
        )}

        <div className="news-detail__content">
          <div className="news-detail__header">
            <p className="news-detail__subtitle">{news.subtitle}</p>
            <time className="news-detail__date" dateTime={news.publishedAt}>
              {formatDate(news.publishedAt)}
            </time>
          </div>

          <div className="news-detail__markdown-container">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {news.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}

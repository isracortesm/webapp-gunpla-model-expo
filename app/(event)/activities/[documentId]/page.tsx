'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/features/auth/context/auth-context';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import {
  getActivityByDocumentId,
  checkActivityRegistration,
  registerActivityParticipant,
  deleteActivityParticipant,
} from '@/features/event-dashboard/service/event-dashboard-service';
import type { ActivityEntity } from '@/domain/entities/event-dashboard/entity';
import './detail.css';

export default function ActivityDetailPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined;
  const { showLoading, hideLoading, showError, showConfirmation, showSuccess } = useUnifiedDialog();
  const [activity, setActivity] = useState<ActivityEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantDocId, setParticipantDocId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function load() {
      showLoading('Cargando actividad...');
      try {
        const data = await getActivityByDocumentId(params.documentId);
        setActivity(data);
      } catch {
        showError('Error al cargar la actividad', 'Error');
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }
    load();
  }, [params.documentId, showLoading, hideLoading, showError]);

  const checkRegistration = useCallback(async (activityId: number, userId: number) => {
    try {
      const result = await checkActivityRegistration(activityId, userId, token);
      setIsRegistered(result.registered);
      setParticipantDocId(result.participantDocumentId);
    } catch {
      // Silently fail, user can still see the activity
    } finally {
      setIsChecking(false);
    }
  }, [token]);

  useEffect(() => {
    if (activity && user && user.id) {
      checkRegistration(activity.id, user.id);
    } else if (activity && !user) {
      setIsChecking(false);
    }
  }, [activity, user, checkRegistration]);

  const handleRegister = async () => {
    if (!activity || !user) return;
    showLoading('Registering...');
    try {
      const result = await registerActivityParticipant(String(activity.id), String(user.id), token);
      setParticipantDocId(result.documentId);

      if (activity.category?.type === 'competition') {
        hideLoading();
        router.push(`/activities/${params.documentId}/competition`);
      } else {
        setIsRegistered(true);
        showSuccess('¡Registrado correctamente!');
        hideLoading();
      }
    } catch {
      showError('Error al registrarse', 'Error');
      hideLoading();
    }
  };

  const handleUnregister = () => {
    if (!participantDocId) return;

    showConfirmation(
      'Cancelar participación',
      '¿Estás seguro de que deseas cancelar tu participación?',
      async () => {
        showLoading('Cancelando...');
        try {
          await deleteActivityParticipant(participantDocId, token);
          setIsRegistered(false);
          setParticipantDocId(null);
          showSuccess('Participación cancelada');
        } catch {
          showError('Error al cancelar la participación', 'Error');
        } finally {
          hideLoading();
        }
      },
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading || !activity) return null;

  return (
    <main className="activity-detail__container">
      <button
        onClick={() => router.push('/activities')}
        className="activity-detail__back-btn"
      >
        Volver
      </button>

      <div className="activity-detail__card">
        {activity.image?.url && (
          <div className="activity-detail__image-container">
            <Image
              src={activity.image.url}
              alt={activity.name}
              fill
              className="object-cover"
              priority
            />
            <div className="activity-detail__gradient-overlay" />
          </div>
        )}

        <div className="activity-detail__content">
          <div className="activity-detail__header">
            <h2 className="activity-detail__title">{activity.name}</h2>
            <p className="activity-detail__subtitle">{activity.shortDescription}</p>

            <div className="activity-detail__meta">
              <span
                className={
                  activity.costType === 'free'
                    ? 'activity-detail__cost-chip--free'
                    : 'activity-detail__cost-chip--paid'
                }
              >
                {activity.costType === 'free' ? 'Gratuito' : `Costo $${Math.round(activity.cost ?? 0)}`}
              </span>
              {activity.capacity != null && (
                <span className="activity-detail__capacity">
                  Aforo: {activity.capacity}
                </span>
              )}
            </div>

            <div className="activity-detail__dates">
              <time className="activity-detail__date" dateTime={activity.startDate}>
                Inicia: {formatDate(activity.startDate)}
              </time>
              <time className="activity-detail__date" dateTime={activity.endDate}>
                Termina: {formatDate(activity.endDate)}
              </time>
            </div>
          </div>

          {activity.category && (
            <section className="activity-detail__section">
              <h3 className="activity-detail__section-title">Categoría</h3>
              <div className="activity-detail__category-card">
                <h4 className="activity-detail__category-name">{activity.category.name}</h4>
                {activity.category.description && (
                  <p className="activity-detail__category-description">{activity.category.description}</p>
                )}
                {isChecking && (
                  <div className="activity-detail__participation">
                    <div className="activity-detail__skeleton-btn" />
                  </div>
                )}
                {!isChecking && user && (
                  <div className="activity-detail__participation">
                    {isRegistered ? (
                      activity.category?.type === 'competition' ? (
                        <button onClick={() => router.push(`/activities/${params.documentId}/competition`)} className="activity-detail__edit-btn">
                          Editar modelos
                        </button>
                      ) : (
                        <button onClick={handleUnregister} className="activity-detail__cancel-btn">
                          Cancelar participación
                        </button>
                      )
                    ) : (
                      <button onClick={handleRegister} className="activity-detail__participate-btn">
                        Participar
                      </button>
                    )}
                  </div>
                )}
                {!isChecking && !user && (
                  <div className="activity-detail__participation">
                    <button onClick={() => router.push('/auth/register')} className="activity-detail__register-btn">
                      Registrarse para participar
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {activity.collaborators && activity.collaborators.length > 0 && (
            <section className="activity-detail__section">
              <h3 className="activity-detail__section-title">Colaboradores</h3>
              <div className="activity-detail__collaborators-list">
                {activity.collaborators.map((collab) => {
                  const username = (collab.user as { username?: string })?.username;

                  return (
                    <div key={collab.id} className="activity-detail__collaborator-card">
                      <div className="activity-detail__collaborator-info">
                        {collab.description && (
                          <p className="activity-detail__collaborator-description">{collab.description}</p>
                        )}
                        {username && (
                          <p className="activity-detail__collaborator-username">{username}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="activity-detail__markdown-container">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {activity.description ?? ''}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}

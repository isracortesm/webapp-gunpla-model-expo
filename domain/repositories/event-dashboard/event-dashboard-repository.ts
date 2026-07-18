import { EventEntity, NewsEntity, ActivityEntity, ActivityParticipantEntity } from '../../../domain/entities/event-dashboard/entity';
import { PaginatedResult } from '../../../domain/entities/common/paginated-result';

export interface EventDashboardRepository {
  getEventByCode(eventCode: string): Promise<EventEntity>;
  getNewsByEvent(
    eventId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<NewsEntity>>;
  getNewsByDocumentId(documentId: string): Promise<NewsEntity>;
  getActivitiesByEvent(
    eventId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<ActivityEntity>>;
  getActivityByDocumentId(documentId: string): Promise<ActivityEntity>;
  registerActivityParticipant(activityId: string, userId: string, token?: string): Promise<ActivityParticipantEntity>;
  deleteActivityParticipant(documentId: string, token?: string): Promise<void>;
  updateActivityParticipant(documentId: string, data: { statusName?: string; checkIn?: boolean }, token: string): Promise<ActivityParticipantEntity>;
  checkActivityRegistration(activityId: number, userId: number, token?: string): Promise<{ total: number; participants: { documentId: string }[] }>;
  getParticipantDetail(activityDocumentId: string, userId: number, token?: string): Promise<PaginatedResult<ActivityParticipantEntity>>;
  getActivityParticipants(activityDocumentId: string, token: string): Promise<PaginatedResult<ActivityParticipantEntity>>;
  getUserActivities(
    userId: number,
    params?: { page?: number; pageSize?: number },
    token?: string
  ): Promise<PaginatedResult<ActivityEntity>>;
}

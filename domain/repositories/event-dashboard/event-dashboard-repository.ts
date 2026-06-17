import { EventEntity, NewsEntity, ActivityEntity } from '../../../domain/entities/event-dashboard/entity';

export interface EventDashboardRepository {
  getEventByCode(eventCode: string): Promise<EventEntity>;
  getNewsByEvent(eventId: number): Promise<NewsEntity[]>;
  getActivitiesByEvent(eventId: number): Promise<ActivityEntity[]>;
}

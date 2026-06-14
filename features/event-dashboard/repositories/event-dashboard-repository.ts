import { EventEntity, NewsEntity, ActivityEntity } from '../types/entity';
import { HttpService } from '../services/http-client';
import { mapEventDtoToEntity, mapNewsDtoToEntity, mapActivityDtoToEntity } from '../mappers/mapper';

export interface EventDashboardRepository {
  getEventByCode(eventCode: string): Promise<EventEntity>;
  getNewsByEvent(eventId: number): Promise<NewsEntity[]>;
  getActivitiesByEvent(eventId: number): Promise<ActivityEntity[]>;
}

export class EventDashboardRepositoryImpl implements EventDashboardRepository {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async getEventByCode(eventCode: string): Promise<EventEntity> {
    const response = await this.httpService.get<{ data: any }>('/api/events', {
      'filters[eventId][$eq]': eventCode,
      populate: 'image,category',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Event with code "${eventCode}" not found`);
    }

    return mapEventDtoToEntity(response.data[0]);
  }

  async getNewsByEvent(eventId: number): Promise<NewsEntity[]> {
    const response = await this.httpService.get<{ data: any }>('/api/news', {
      'filters[event][$eq]': String(eventId),
      populate: 'thumbnail',
    });

    return response.data.map(mapNewsDtoToEntity);
  }

  async getActivitiesByEvent(eventId: number): Promise<ActivityEntity[]> {
    const response = await this.httpService.get<{ data: any }>('/api/activities', {
      'filters[event][$eq]': String(eventId),
      populate: 'image,category',
    });

    return response.data.map(mapActivityDtoToEntity);
  }
}

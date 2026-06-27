import { EventEntity, NewsEntity, ActivityEntity } from '../../../domain/entities/event-dashboard/entity';
import { PaginatedResult } from '../../../domain/entities/common/paginated-result';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';
import { HttpService } from '../../services/http-client';
import {
  mapEventDtoToEntity,
  mapNewsDtoToEntity,
  mapActivityDtoToEntity,
  StrapiEventResponse,
  StrapiNewsResponse,
  StrapiActivityResponse,
} from '../../mappers/event-dashboard/mapper';

export class EventDashboardRepositoryImpl implements EventDashboardRepository {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async getEventByCode(eventCode: string): Promise<EventEntity> {
    const response = await this.httpService.get<{ data: StrapiEventResponse[] }>('/api/events', {
      'filters[eventId][$eq]': eventCode,
      populate: ['image', 'category', 'socialNetworks'],
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Event with code "${eventCode}" not found`);
    }

    return mapEventDtoToEntity(response.data[0]);
  }

  async getNewsByEvent(
    eventId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<NewsEntity>> {
    const queryParams: Record<string, string | string[]> = {
      'filters[event][$eq]': String(eventId),
      'populate[thumbnail][fields][0]': 'url',
      'fields[0]': 'title',
      'fields[1]': 'subtitle',
      'fields[2]': 'publishedAt',
      'fields[3]': 'documentId',
    };

    if (params?.page) {
      queryParams['pagination[page]'] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = String(params.pageSize);
    }

    const response = await this.httpService.get<{ data: StrapiNewsResponse[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } }>('/api/news', queryParams);

    return {
      data: response.data.map(mapNewsDtoToEntity),
      meta: {
        pagination: {
          page: response.meta.pagination.page,
          pageSize: response.meta.pagination.pageSize,
          pageCount: response.meta.pagination.pageCount,
          total: response.meta.pagination.total,
        },
      },
    };
  }

  async getNewsByDocumentId(documentId: string): Promise<NewsEntity> {
    const response = await this.httpService.get<{ data: StrapiNewsResponse }>(
      `/api/news/${documentId}`,
      { populate: ['thumbnail', 'user'] }
    );

    return mapNewsDtoToEntity(response.data);
  }

  async getActivitiesByEvent(
    eventId: number,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<ActivityEntity>> {
    const queryParams: Record<string, string | string[]> = {
      'filters[event][$eq]': String(eventId),
      'populate[image][fields][0]': 'url',
      'fields[0]': 'name',
      'fields[1]': 'shortDescription',
      'fields[2]': 'costType',
      'fields[3]': 'cost',
      'fields[4]': 'startDate',
      'fields[5]': 'endDate',
      'fields[6]': 'capacity',
    };

    if (params?.page) {
      queryParams['pagination[page]'] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = String(params.pageSize);
    }

    const response = await this.httpService.get<{ data: StrapiActivityResponse[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } }>('/api/activities', queryParams);

    return {
      data: response.data.map(mapActivityDtoToEntity),
      meta: {
        pagination: {
          page: response.meta.pagination.page,
          pageSize: response.meta.pagination.pageSize,
          pageCount: response.meta.pagination.pageCount,
          total: response.meta.pagination.total,
        },
      },
    };
  }
}

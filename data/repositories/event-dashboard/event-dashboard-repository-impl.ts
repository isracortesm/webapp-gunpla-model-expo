import { EventEntity, NewsEntity, ActivityEntity, ActivityParticipantEntity, CollaboratorEntity, CollaboratorEvaluationMetadata } from '../../../domain/entities/event-dashboard/entity';
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
      'fields[7]': 'participantsCount',
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

  async getActivityByDocumentId(documentId: string): Promise<ActivityEntity> {
    const response = await this.httpService.get<{ data: StrapiActivityResponse }>(
      `/api/activities/${documentId}`,
      {
        'populate[image]': 'true',
        'populate[category]': 'true',
        'populate[collaborators][populate][user]': 'true',
      }
    );

    return mapActivityDtoToEntity(response.data);
  }

  async registerActivityParticipant(activityId: string, userId: string, token?: string): Promise<ActivityParticipantEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: ActivityParticipantEntity }>('/api/activity-participants', {
      data: {
        activity: activityId,
        user: userId,
      },
    });

    return response.data;
  }

  async deleteActivityParticipant(documentId: string, token?: string): Promise<void> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    await http.delete<void>(`/api/activity-participants/${documentId}`);
  }

  async checkActivityRegistration(activityId: number, userId: number, token?: string): Promise<{ total: number; participants: { documentId: string }[] }> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{
      data: { documentId: string }[];
      meta: { pagination: { total: number } };
    }>('/api/activity-participants', {
      'filters[activity][id][$eq]': String(activityId),
      'filters[user][id][$eq]': String(userId),
    });
    return {
      total: response.meta.pagination.total,
      participants: response.data,
    };
  }

  async getParticipantDetail(
    activityDocumentId: string,
    userId: number,
    token?: string
  ): Promise<PaginatedResult<ActivityParticipantEntity>> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{
      data: ActivityParticipantEntity[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>('/api/activity-participants', {
      'populate[activity][fields][0]': 'name',
      'populate[activity][fields][1]': 'shortDescription',
      'filters[activity][documentId][$eq]': activityDocumentId,
      'filters[user][id][$eq]': String(userId),
    });

    return {
      data: response.data,
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

  async getActivityParticipants(
    activityDocumentId: string,
    token: string
  ): Promise<PaginatedResult<ActivityParticipantEntity>> {
    const http = new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token);

    const pageSize = 100;
    let page = 1;
    let data: ActivityParticipantEntity[] = [];
    let pagination = { page: 1, pageSize, pageCount: 1, total: 0 };

    while (true) {
      const response = await http.get<{
        data: ActivityParticipantEntity[];
        meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
      }>('/api/activity-participants', {
        'populate[user][fields][0]': 'username',
        'populate[user][fields][1]': 'email',
        'populate[user][fields][2]': 'documentId',
        'filters[activity][documentId][$eq]': activityDocumentId,
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
      });

      data = data.concat(response.data);
      pagination = response.meta.pagination;
      if (page >= pagination.pageCount || data.length >= pagination.total) break;
      page += 1;
    }

    return {
      data,
      meta: {
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
        },
      },
    };
  }

  async updateActivityParticipant(
    documentId: string,
    data: { statusName?: string; checkIn?: boolean },
    token: string
  ): Promise<ActivityParticipantEntity> {
    const http = new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token);
    const response = await http.put<{ data: ActivityParticipantEntity }>(
      `/api/activity-participants/${documentId}`,
      { data }
    );
    return response.data;
  }

  async updateActivityCollaboratorMetadata(
    documentId: string,
    metadata: CollaboratorEvaluationMetadata,
    token: string
  ): Promise<CollaboratorEntity> {
    const http = new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token);
    const response = await http.put<{ data: CollaboratorEntity }>(
      `/api/activity-collaborators/${documentId}`,
      { data: { metadata } }
    );
    return response.data;
  }

  async getUserActivities(
    userId: number,
    params?: { page?: number; pageSize?: number },
    token?: string
  ): Promise<PaginatedResult<ActivityEntity>> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const queryParams: Record<string, string | string[]> = {
      'populate[activity][populate][image]': 'true',
      'filters[user][id][$eq]': String(userId),
    };

    if (params?.page) {
      queryParams['pagination[page]'] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = String(params.pageSize);
    }

    const response = await http.get<{
      data: { activity: StrapiActivityResponse }[];
      meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
    }>('/api/activity-participants', queryParams);

    return {
      data: response.data.map((item) => mapActivityDtoToEntity(item.activity)),
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

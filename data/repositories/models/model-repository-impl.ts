import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { HttpService } from '@/data/services/http-client';
import { mapModelDtoToEntity } from '../../mappers/models/model-mapper';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';
import { ModelEntity } from '@/domain/entities/models/model-entity';

export class ModelRepositoryImpl implements ModelRepository {
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
  }

  async getModels(params?: { page?: number; pageSize?: number, userId?: number }): Promise<PaginatedModelResult> {
    const queryParams: Record<string, string | string[]> = {};
    
    if (params?.page) {
      queryParams['pagination[page]'] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = String(params.pageSize);
    }
    if (params?.userId) {
      queryParams['filters[user][id][$eq]'] = String(params.userId);
    }
    
    const response = await this.http.get<{ data: any; meta: any }>('/api/models', {
      populate: ['image', 'references', 'user'],
      ...queryParams,
    });
    
    return {
      data: response.data.map(mapModelDtoToEntity),
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

  async createModel(params: {
    name: string;
    description: string;
    userId: number;
    imageId?: number;
    references?: {
      type: string;
      name: string;
      url: string;
    }[];
  }): Promise<ModelEntity> {
    const body = {
      data: {
        name: params.name,
        description: params.description,
        user: params.userId,
        image: params.imageId,
        references: params.references?.map((ref) => ({
          type: ref.type,
          name: ref.name,
          url: ref.url,
        })),
      },
    };

    const response = await this.http.post<{ data: any }>('/api/models', body);
    return mapModelDtoToEntity(response.data);
  }
}

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
    
    queryParams['populate[image][fields][0]'] = 'url'
    queryParams['populate[image][fields][1]'] = 'formats'

    const response = await this.http.get<{ data: any; meta: any }>('/api/models', {
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

  async getModel(modelId: number): Promise<ModelEntity> {
    const queryParams: Record<string, string | string[]> = {};
    if (modelId) {
      queryParams['filters[id][$eq]'] = String(modelId);
    }

    const response = await this.http.get<{ data: any; meta: any }>('/api/models', {
      populate: ['user', 'references', 'image'],
      ...queryParams,
    });

    return response.data.map(mapModelDtoToEntity)[0];
  }

  async createModel(params: {
    name: string;
    description: string;
    userId: number;
    imageId?: number;
    token?: string;
    references?: {
      type: string;
      name: string;
      url: string;
    }[];
  }): Promise<ModelEntity> {
    const http = params.token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', params.token)
      : this.http;

    const body = {
      data: {
        name: params.name,
        description: params.description,
        user: String(params.userId),
        image: params.imageId ? String(params.imageId) : undefined,
        references: params.references?.map((ref) => ({
          type: ref.type,
          name: ref.name,
          url: ref.url,
        })),
      },
    };

    const response = await http.post<{ data: any }>('/api/models', body);
    return mapModelDtoToEntity(response.data);
  }

  async getModelByDocumentId(documentId: string): Promise<ModelEntity> {
    const response = await this.http.get<{ data: any }>(`/api/models/${documentId}`, {
      populate: ['user', 'references', 'image'],
    });
    return mapModelDtoToEntity(response.data);
  }

  async deleteModel(documentId: string): Promise<void> {
    await this.http.delete(`/api/models/${documentId}`);
  }
}


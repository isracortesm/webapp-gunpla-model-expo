import { ModelRepository } from '@/domain/repositories/models/model-repository';
import { HttpService } from '@/data/services/http-client';
import { ModelDto, ApiResponse } from '../../dtos/models/model-dto';
import { mapModelDtoToEntity } from '../../mappers/models/model-mapper';

export class ModelRepositoryImpl implements ModelRepository {
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
  }

  async getModels(params?: { page?: number; pageSize?: number }): Promise<any[]> {
    const queryParams: Record<string, string | string[]> = {};
    
    if (params?.page) {
      queryParams['pagination[page]'] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = String(params.pageSize);
    }

    const response = await this.http.get<{ data: any }>('/api/models', {
      populate: ['image', 'references', 'user'],
      ...queryParams,
    });

    return response.data.map(mapModelDtoToEntity);
  }
}

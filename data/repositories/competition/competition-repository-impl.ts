import { CompetitionEntity, CompetitionModelEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';
import { HttpService } from '../../services/http-client';
import { mapCompetitionDtoToEntity, StrapiCompetitionResponse } from '../../mappers/competition/mapper';

export class CompetitionRepositoryImpl implements CompetitionRepository {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async getCompetitions(token?: string): Promise<CompetitionEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionResponse[] }>('/api/competitions', {
      'populate[categories][populate][criterias]': 'true',
    });

    return response.data.map(mapCompetitionDtoToEntity);
  }

  async registerCompetitionModel(
    data: { competition: string; user: string; model: string; category: string },
    token?: string
  ): Promise<CompetitionModelEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: CompetitionModelEntity }>('/api/competition-models', {
      data: {
        competition: data.competition,
        user: data.user,
        model: data.model,
        category: data.category,
      },
    });

    return response.data;
  }

  async deleteCompetitionModel(documentId: string, token?: string): Promise<void> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    await http.delete<void>(`/api/competition-models/${documentId}`);
  }
}

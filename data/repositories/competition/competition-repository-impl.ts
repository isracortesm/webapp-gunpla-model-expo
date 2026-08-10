import { CompetitionEntity, CompetitionModelEntity, CompetitionModelEntryEntity, CompetitionResultEntity, CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';
import { HttpService } from '../../services/http-client';
import {
  mapCompetitionDtoToEntity,
  mapCompetitionModelEntryDtoToEntity,
  mapCompetitionResultDtoToEntity,
  mapCompetitionEvaluationDtoToEntity,
  StrapiCompetitionResponse,
  StrapiCompetitionModelEntryResponse,
  StrapiCompetitionResultResponse,
  StrapiCompetitionEvaluationResponse,
} from '../../mappers/competition/mapper';

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

  async getCompetitionModels(
    competitionId: number,
    userId: number,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionModelEntryResponse[] }>('/api/competition-models', {
      'populate[model][populate][image]': 'true',
      'filters[competition][id][$eq]': String(competitionId),
      'filters[user][id][$eq]': String(userId),
    });

    return response.data.map(mapCompetitionModelEntryDtoToEntity);
  }

  async getCompetitionModelsByActivity(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionModelEntryResponse[] }>('/api/competition-models', {
      'populate[model][populate][image]': 'true',
      'populate[user][fields][0]': 'username',
      'populate[user][fields][1]': 'email',
      'populate[category][populate][criterias]': 'true',
      'filters[competition][activity][documentId][$eq]': activityDocumentId,
    });

    return response.data.map(mapCompetitionModelEntryDtoToEntity);
  }

  async getCompetitionByActivity(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionResponse[] }>('/api/competitions', {
      'populate[categories][populate][criterias]': 'true',
      'filters[activity][documentId][$eq]': activityDocumentId,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No competition found for this activity');
    }

    return mapCompetitionDtoToEntity(response.data[0]);
  }

  async getCompetitionResult(
    competitionDocumentId: string,
    modelDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity | null> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionResultResponse[] }>('/api/competition-results', {
      'filters[competition][documentId][$eq]': competitionDocumentId,
      'filters[model][documentId][$eq]': modelDocumentId,
    });

    const result = response.data[0];
    return result ? mapCompetitionResultDtoToEntity(result) : null;
  }

  async createCompetitionResult(
    data: { competition: string; model: string; order?: number; totalPoints?: number },
    token?: string
  ): Promise<CompetitionResultEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: StrapiCompetitionResultResponse }>('/api/competition-results', {
      data: {
        order: data.order ?? 0,
        totalPoints: data.totalPoints ?? 0,
        competition: data.competition,
        model: data.model,
      },
    });

    return mapCompetitionResultDtoToEntity(response.data);
  }

  async getCompetitionEvaluationsByResultAndReviewer(
    resultDocumentId: string,
    reviewerDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionEvaluationResponse[] }>('/api/competition-evaluations', {
      'filters[result][documentId][$eq]': resultDocumentId,
      'filters[reviewer][documentId][$eq]': reviewerDocumentId,
    });

    return response.data.map(mapCompetitionEvaluationDtoToEntity);
  }

  async createCompetitionEvaluation(
    data: { criteria: string; points: number; comments?: string; result: string; reviewer: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: StrapiCompetitionEvaluationResponse }>('/api/competition-evaluations', {
      data: {
        criteria: data.criteria,
        points: data.points,
        comments: data.comments ?? '',
        result: data.result,
        reviewer: data.reviewer,
      },
    });

    return mapCompetitionEvaluationDtoToEntity(response.data);
  }

  async updateCompetitionEvaluation(
    documentId: string,
    data: { points: number; comments?: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.put<{ data: StrapiCompetitionEvaluationResponse }>(
      `/api/competition-evaluations/${documentId}`,
      {
        data: {
          points: data.points,
          comments: data.comments ?? '',
        },
      }
    );

    return mapCompetitionEvaluationDtoToEntity(response.data);
  }
}

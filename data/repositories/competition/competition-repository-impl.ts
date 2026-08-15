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
      'populate[batchLimits][populate][batch]': 'true',
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
      ...this.resultPopulateParams(),
      'filters[competition][documentId][$eq]': competitionDocumentId,
      'filters[model][documentId][$eq]': modelDocumentId,
    });

    const result = response.data[0];
    return result ? mapCompetitionResultDtoToEntity(result) : null;
  }

  async getCompetitionResultByModel(
    competitionDocumentId: string,
    modelDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity | null> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionResultResponse[] }>('/api/competition-results', {
      ...this.resultPopulateParams(),
      'filters[competition][documentId][$eq]': competitionDocumentId,
      'filters[model][model][documentId][$eq]': modelDocumentId,
    });

    const result = response.data[0];
    return result ? mapCompetitionResultDtoToEntity(result) : null;
  }

  async getCompetitionResultsByCompetition(
    competitionDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionResultResponse[] }>('/api/competition-results', {
      ...this.resultPopulateParams(),
      'filters[competition][documentId][$eq]': competitionDocumentId,
    });

    return response.data.map(mapCompetitionResultDtoToEntity);
  }

  private resultPopulateParams() {
    return {
      'populate[model][populate][model][populate][image]': 'true',
      'populate[model][populate][user][fields][0]': 'username',
      'populate[model][populate][user][fields][1]': 'email',
      'populate[model][populate][category][populate][criterias]': 'true',
      'populate[batch][populate][batchImage]': 'true',
    };
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

  async sendResultEmail(
    data: { participant: string; competition: string; cc?: string },
    token?: string
  ): Promise<{ sentTo: string; resultsCount: number }> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: { sentTo: string; resultsCount: number } }>(
      '/api/competition-results/send-result-email',
      {
        data: {
          participant: data.participant,
          competition: data.competition,
          ...(data.cc ? { cc: data.cc } : {}),
        },
      }
    );

    return response.data;
  }

  async sendResultEmailsToAll(
    data: { competition: string },
    token?: string
  ): Promise<{ total: number; sent: number; failed: number; errors: { participant?: string; error: string }[] }> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{
      data: { total: number; sent: number; failed: number; errors: { participant?: string; error: string }[] };
    }>('/api/competition-results/send-result-emails-to-all', {
      data: {
        competition: data.competition,
      },
    });

    return response.data;
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
      'populate[criteria]': 'true',
    });

    return response.data.map(mapCompetitionEvaluationDtoToEntity);
  }

  async getCompetitionEvaluationsByResult(
    resultDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.get<{ data: StrapiCompetitionEvaluationResponse[] }>('/api/competition-evaluations', {
      'filters[result][documentId][$eq]': resultDocumentId,
      'populate[criteria]': 'true',
      'populate[reviewer][populate][user][fields][0]': 'username',
      'populate[reviewer][populate][user][fields][1]': 'email',
    });

    return response.data.map(mapCompetitionEvaluationDtoToEntity);
  }

  async createCompetitionEvaluation(
    data: { name: string; criteria: string; points: number; comments?: string; result: string; reviewer: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity> {
    const http = token
      ? new HttpService(process.env.NEXT_PUBLIC_HOST_URI || '', token)
      : this.httpService;

    const response = await http.post<{ data: StrapiCompetitionEvaluationResponse }>('/api/competition-evaluations', {
      data: {
        name: data.name,
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

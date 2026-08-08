import { CompetitionEntity, CompetitionModelEntity, CompetitionModelEntryEntity, CompetitionResultEntity, CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';

export interface CompetitionRepository {
  getCompetitions(token?: string): Promise<CompetitionEntity[]>;
  registerCompetitionModel(
    data: { competition: string; user: string; model: string; category: string },
    token?: string
  ): Promise<CompetitionModelEntity>;
  deleteCompetitionModel(documentId: string, token?: string): Promise<void>;
  getCompetitionModels(
    competitionId: number,
    userId: number,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]>;
  getCompetitionModelsByActivity(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]>;
  getCompetitionByActivity(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionEntity>;
  getCompetitionResult(
    competitionDocumentId: string,
    modelDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity | null>;
  createCompetitionResult(
    data: { competition: string; model: string; order?: number; totalPoints?: number },
    token?: string
  ): Promise<CompetitionResultEntity>;
  getCompetitionEvaluationsByResultAndReviewer(
    resultDocumentId: string,
    reviewerDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]>;
}

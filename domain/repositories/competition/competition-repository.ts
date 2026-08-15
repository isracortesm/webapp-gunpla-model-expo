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
  getCompetitionResultByModel(
    competitionDocumentId: string,
    modelDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity | null>;
  getCompetitionResultsByCompetition(
    competitionDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity[]>;
  sendResultEmail(
    data: { participant: string; competition: string },
    token?: string
  ): Promise<{ sentTo: string; resultsCount: number }>;
  sendResultEmailsToAll(
    data: { competition: string },
    token?: string
  ): Promise<{ total: number; sent: number; failed: number; errors: { participant?: string; error: string }[] }>;
  createCompetitionResult(
    data: { competition: string; model: string; order?: number; totalPoints?: number },
    token?: string
  ): Promise<CompetitionResultEntity>;
  getCompetitionEvaluationsByResultAndReviewer(
    resultDocumentId: string,
    reviewerDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]>;
  getCompetitionEvaluationsByResult(
    resultDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]>;
  createCompetitionEvaluation(
    data: { name: string; criteria: string; points: number; comments?: string; result: string; reviewer: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity>;
  updateCompetitionEvaluation(
    documentId: string,
    data: { points: number; comments?: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity>;
}

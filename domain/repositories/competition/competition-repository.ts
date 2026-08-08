import { CompetitionEntity, CompetitionModelEntity, CompetitionModelEntryEntity } from '../../../domain/entities/competition/entity';

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
}

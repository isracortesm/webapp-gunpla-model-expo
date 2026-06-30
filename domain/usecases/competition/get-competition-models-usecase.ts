import { CompetitionModelEntryEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionModelsUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    competitionId: number,
    userId: number,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]> {
    return this.repository.getCompetitionModels(competitionId, userId, token);
  }
}

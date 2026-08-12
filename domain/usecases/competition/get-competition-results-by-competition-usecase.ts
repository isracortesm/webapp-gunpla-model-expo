import { CompetitionResultEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionResultsByCompetitionUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    competitionDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity[]> {
    return this.repository.getCompetitionResultsByCompetition(
      competitionDocumentId,
      token
    );
  }
}

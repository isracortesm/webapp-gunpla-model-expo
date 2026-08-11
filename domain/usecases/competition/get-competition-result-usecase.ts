import { CompetitionResultEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionResultUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    competitionDocumentId: string,
    modelDocumentId: string,
    token?: string
  ): Promise<CompetitionResultEntity | null> {
    return this.repository.getCompetitionResult(
      competitionDocumentId,
      modelDocumentId,
      token
    );
  }
}

import { CompetitionModelEntryEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionModelsByActivityUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionModelEntryEntity[]> {
    return this.repository.getCompetitionModelsByActivity(activityDocumentId, token);
  }
}

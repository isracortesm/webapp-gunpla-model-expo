import { CompetitionEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionByActivityUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    activityDocumentId: string,
    token?: string
  ): Promise<CompetitionEntity> {
    return this.repository.getCompetitionByActivity(activityDocumentId, token);
  }
}

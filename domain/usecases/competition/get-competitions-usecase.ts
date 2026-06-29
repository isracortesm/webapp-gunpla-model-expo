import { CompetitionEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionsUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(token?: string): Promise<CompetitionEntity[]> {
    return this.repository.getCompetitions(token);
  }
}

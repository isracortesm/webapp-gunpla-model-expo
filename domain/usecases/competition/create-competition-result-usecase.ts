import { CompetitionResultEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class CreateCompetitionResultUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    data: { competition: string; model: string; order?: number; totalPoints?: number },
    token?: string
  ): Promise<CompetitionResultEntity> {
    return this.repository.createCompetitionResult(data, token);
  }
}

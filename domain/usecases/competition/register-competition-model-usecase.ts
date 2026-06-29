import { CompetitionModelEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class RegisterCompetitionModelUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    data: { competition: string; user: string; model: string; category: string },
    token?: string
  ): Promise<CompetitionModelEntity> {
    return this.repository.registerCompetitionModel(data, token);
  }
}

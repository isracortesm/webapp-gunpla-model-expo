import { CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class CreateCompetitionEvaluationUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    data: { name: string; criteria: string; points: number; comments?: string; result: string; reviewer: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity> {
    return this.repository.createCompetitionEvaluation(data, token);
  }
}

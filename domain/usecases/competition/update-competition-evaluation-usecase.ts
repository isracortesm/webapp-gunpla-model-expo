import { CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class UpdateCompetitionEvaluationUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    documentId: string,
    data: { points: number; comments?: string },
    token?: string
  ): Promise<CompetitionEvaluationEntity> {
    return this.repository.updateCompetitionEvaluation(documentId, data, token);
  }
}

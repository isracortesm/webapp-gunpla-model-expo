import { CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionEvaluationsByResultUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    resultDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]> {
    return this.repository.getCompetitionEvaluationsByResult(
      resultDocumentId,
      token
    );
  }
}

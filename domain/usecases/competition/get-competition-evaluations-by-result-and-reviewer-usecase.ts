import { CompetitionEvaluationEntity } from '../../../domain/entities/competition/entity';
import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class GetCompetitionEvaluationsByResultAndReviewerUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    resultDocumentId: string,
    reviewerDocumentId: string,
    token?: string
  ): Promise<CompetitionEvaluationEntity[]> {
    return this.repository.getCompetitionEvaluationsByResultAndReviewer(
      resultDocumentId,
      reviewerDocumentId,
      token
    );
  }
}

import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class DeleteCompetitionModelUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(documentId: string, token?: string): Promise<void> {
    return this.repository.deleteCompetitionModel(documentId, token);
  }
}

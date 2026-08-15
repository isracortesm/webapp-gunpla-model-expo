import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class SendResultEmailsToAllUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    data: { competition: string },
    token?: string
  ): Promise<{ total: number; sent: number; failed: number; errors: { participant?: string; error: string }[] }> {
    return this.repository.sendResultEmailsToAll(data, token);
  }
}

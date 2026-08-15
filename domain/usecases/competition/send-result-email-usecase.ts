import { CompetitionRepository } from '../../../domain/repositories/competition/competition-repository';

export class SendResultEmailUseCase {
  private repository: CompetitionRepository;

  constructor(repository: CompetitionRepository) {
    this.repository = repository;
  }

  async execute(
    data: { participant: string; competition: string; cc?: string },
    token?: string
  ): Promise<{ sentTo: string; resultsCount: number }> {
    return this.repository.sendResultEmail(data, token);
  }
}

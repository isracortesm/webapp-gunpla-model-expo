import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class DeleteActivityParticipantUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<void> {
    return this.repository.deleteActivityParticipant(documentId);
  }
}

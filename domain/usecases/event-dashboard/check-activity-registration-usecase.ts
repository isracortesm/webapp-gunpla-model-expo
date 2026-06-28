import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class CheckActivityRegistrationUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(activityId: number, userId: number): Promise<{ registered: boolean; participantDocumentId: string | null }> {
    const result = await this.repository.checkActivityRegistration(activityId, userId);
    return {
      registered: result.total > 0,
      participantDocumentId: result.participants[0]?.documentId ?? null,
    };
  }
}

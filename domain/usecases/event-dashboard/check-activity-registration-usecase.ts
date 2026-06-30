import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class CheckActivityRegistrationUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(activityId: number, userId: number, token?: string): Promise<{ registered: boolean; participantDocumentId: string | null }> {
    const result = await this.repository.checkActivityRegistration(activityId, userId, token);
    return {
      registered: result.total > 0,
      participantDocumentId: result.participants[0]?.documentId ?? null,
    };
  }
}

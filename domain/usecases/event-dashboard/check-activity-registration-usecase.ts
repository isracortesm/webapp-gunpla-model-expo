import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class CheckActivityRegistrationUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(activityId: number, userId: number): Promise<boolean> {
    const total = await this.repository.checkActivityRegistration(activityId, userId);
    return total > 0;
  }
}

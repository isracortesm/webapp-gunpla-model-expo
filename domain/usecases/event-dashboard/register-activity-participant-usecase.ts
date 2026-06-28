import { ActivityParticipantEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class RegisterActivityParticipantUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(activityId: string, userId: string): Promise<ActivityParticipantEntity> {
    return this.repository.registerActivityParticipant(activityId, userId);
  }
}

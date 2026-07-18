import { ActivityParticipantEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class UpdateActivityParticipantUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(
    documentId: string,
    data: { statusName?: string; checkIn?: boolean },
    token: string
  ): Promise<ActivityParticipantEntity> {
    return this.repository.updateActivityParticipant(documentId, data, token);
  }
}

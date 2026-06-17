import { ActivityEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetEventActivitiesUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(eventId: number): Promise<ActivityEntity[]> {
    return this.repository.getActivitiesByEvent(eventId);
  }
}

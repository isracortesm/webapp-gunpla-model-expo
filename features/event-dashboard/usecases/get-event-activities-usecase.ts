import { ActivityEntity } from '../types/entity';
import { EventDashboardRepository } from '..//repositories/event-dashboard-repository';

export class GetEventActivitiesUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(eventId: number): Promise<ActivityEntity[]> {
    return this.repository.getActivitiesByEvent(eventId);
  }
}

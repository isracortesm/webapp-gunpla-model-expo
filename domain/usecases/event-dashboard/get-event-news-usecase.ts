import { NewsEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetEventNewsUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(eventId: number): Promise<NewsEntity[]> {
    return this.repository.getNewsByEvent(eventId);
  }
}

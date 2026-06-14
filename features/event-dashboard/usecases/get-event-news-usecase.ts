import { NewsEntity } from '../types/entity';
import { EventDashboardRepository } from '../repositories/event-dashboard-repository';

export class GetEventNewsUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(eventId: number): Promise<NewsEntity[]> {
    return this.repository.getNewsByEvent(eventId);
  }
}

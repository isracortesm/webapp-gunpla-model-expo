import { EventEntity } from '../types/entity';
import { EventDashboardRepository } from '../repositories/event-dashboard-repository';

export class GetEventUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(eventCode: string): Promise<EventEntity> {
    return this.repository.getEventByCode(eventCode);
  }
}

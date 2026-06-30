import { ActivityEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetActivityByDocumentIdUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<ActivityEntity> {
    return this.repository.getActivityByDocumentId(documentId);
  }
}

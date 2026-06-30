import { NewsEntity } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetNewsByDocumentIdUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(documentId: string): Promise<NewsEntity> {
    return this.repository.getNewsByDocumentId(documentId);
  }
}

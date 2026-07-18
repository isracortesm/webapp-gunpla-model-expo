import { ActivityParticipantEntity } from '../../../domain/entities/event-dashboard/entity';
import { PaginatedResult } from '../../../domain/entities/common/paginated-result';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetParticipantDetailUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(
    activityDocumentId: string,
    userId: number,
    token?: string
  ): Promise<PaginatedResult<ActivityParticipantEntity>> {
    return this.repository.getParticipantDetail(activityDocumentId, userId, token);
  }
}

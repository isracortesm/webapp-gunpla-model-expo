import { ActivityEntity } from '../../../domain/entities/event-dashboard/entity';
import { PaginatedResult } from '../../../domain/entities/common/paginated-result';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class GetUserActivitiesUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(
    userId: number,
    params?: { page?: number; pageSize?: number },
    token?: string
  ): Promise<PaginatedResult<ActivityEntity>> {
    return this.repository.getUserActivities(userId, params, token);
  }
}

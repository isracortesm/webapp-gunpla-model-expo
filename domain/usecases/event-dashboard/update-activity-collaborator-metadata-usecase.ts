import { CollaboratorEntity, CollaboratorEvaluationMetadata } from '../../../domain/entities/event-dashboard/entity';
import { EventDashboardRepository } from '../../../domain/repositories/event-dashboard/event-dashboard-repository';

export class UpdateActivityCollaboratorMetadataUseCase {
  private repository: EventDashboardRepository;

  constructor(repository: EventDashboardRepository) {
    this.repository = repository;
  }

  async execute(
    documentId: string,
    metadata: CollaboratorEvaluationMetadata,
    token: string
  ): Promise<CollaboratorEntity> {
    return this.repository.updateActivityCollaboratorMetadata(documentId, metadata, token);
  }
}

import { CreateModelReferenceParams, ModelReferenceResponseEntity } from '@/domain/entities/model-references/entity';

export interface ModelReferenceRepository {
  createModelReference(params: CreateModelReferenceParams, token?: string): Promise<ModelReferenceResponseEntity>;
  deleteModelReference(documentId: string, token?: string): Promise<void>;
}

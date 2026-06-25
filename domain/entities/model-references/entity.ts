export interface ModelReferenceEntity {
  id: number;
  documentId?: string;
  type: string;
  name: string;
  url: string;
}

export interface CreateModelReferenceParams {
  type: string;
  name: string;
  url: string;
  modelId: string;
}

export interface ModelReferenceResponseEntity {
  data: ModelReferenceEntity;
  meta?: Record<string, unknown>;
}

import { GetModelsUseCase } from "@/domain/usecases/models/get-models-usecase";
import { GetModelByDocumentIdUseCase } from "@/domain/usecases/models/get-model-by-document-id-usecase";
import { CreateModelUseCase } from "@/domain/usecases/models/create-model-usecase";
import { DeleteModelUseCase } from "@/domain/usecases/models/delete-model-usecase";
import { ModelRepositoryImpl } from "@/data/repositories/models/model-repository-impl";
import { MediaRepositoryImpl } from "@/data/repositories/media/media-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const modelRepository = new ModelRepositoryImpl(httpService);
const mediaRepository = new MediaRepositoryImpl(httpService);
const getModelsUseCase = new GetModelsUseCase(modelRepository);
const getModelByDocumentIdUseCase = new GetModelByDocumentIdUseCase(modelRepository);
const createModelUseCase = new CreateModelUseCase(modelRepository);
const deleteModelUseCase = new DeleteModelUseCase(modelRepository, mediaRepository);

export async function getModels(page: number, pageSize: number, userId: number) {
  return getModelsUseCase.execute({
    page, pageSize, userId });
}

export async function createModel(params: {
  name: string;
  description: string;
  userId: number;
  imageId?: number;
  token?: string;
  references?: {
    type: string;
    name: string;
    url: string;
  }[];
}) {
  return createModelUseCase.execute(params);
}

export async function getModelByDocumentId(documentId: string) {
  return getModelByDocumentIdUseCase.execute(documentId);
}

export async function deleteModel(params: {
  documentId: string;
  imageId?: number;
  token?: string;
}): Promise<void> {
  return deleteModelUseCase.execute(params);
}

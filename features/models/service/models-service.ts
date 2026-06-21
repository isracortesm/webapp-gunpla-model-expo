import { GetModelsUseCase } from "@/domain/usecases/models/get-models-usecase";
import { CreateModelUseCase } from "@/domain/usecases/models/create-model-usecase";
import { ModelRepositoryImpl } from "@/data/repositories/models/model-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new ModelRepositoryImpl(httpService);
const getModelsUseCase = new GetModelsUseCase(repository);
const createModelUseCase = new CreateModelUseCase(repository);

export async function getModels(page: number, pageSize: number, userId: number) {
  return getModelsUseCase.execute({
    page, pageSize, userId });
}

export async function createModel(params: {
  name: string;
  description: string;
  userId: number;
  imageId?: number;
  references?: {
    type: string;
    name: string;
    url: string;
  }[];
}) {
  return createModelUseCase.execute(params);
}

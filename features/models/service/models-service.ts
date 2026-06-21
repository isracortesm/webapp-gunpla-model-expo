import { GetModelsUseCase } from "@/domain/usecases/models/get-models-usecase";
import { ModelRepositoryImpl } from "@/data/repositories/models/model-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new ModelRepositoryImpl(httpService);
const getModelsUseCase = new GetModelsUseCase(repository);

export async function getModels(page: number, pageSize: number, userId: number) {
  return getModelsUseCase.execute({
    page, pageSize, userId });
}

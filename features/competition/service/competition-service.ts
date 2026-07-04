import { GetCompetitionsUseCase } from "@/domain/usecases/competition/get-competitions-usecase";
import { RegisterCompetitionModelUseCase } from "@/domain/usecases/competition/register-competition-model-usecase";
import { DeleteCompetitionModelUseCase } from "@/domain/usecases/competition/delete-competition-model-usecase";
import { GetCompetitionModelsUseCase } from "@/domain/usecases/competition/get-competition-models-usecase";
import { CompetitionRepositoryImpl } from "@/data/repositories/competition/competition-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new CompetitionRepositoryImpl(httpService);
const getCompetitionsUseCase = new GetCompetitionsUseCase(repository);
const registerCompetitionModelUseCase = new RegisterCompetitionModelUseCase(repository);
const deleteCompetitionModelUseCase = new DeleteCompetitionModelUseCase(repository);
const getCompetitionModelsUseCase = new GetCompetitionModelsUseCase(repository);

export async function getCompetitions(token?: string) {
  return getCompetitionsUseCase.execute(token);
}

export async function registerCompetitionModel(
  data: { competition: string; user: string; model: string; category: string },
  token?: string
) {
  return registerCompetitionModelUseCase.execute(data, token);
}

export async function deleteCompetitionModel(documentId: string, token?: string) {
  return deleteCompetitionModelUseCase.execute(documentId, token);
}

export async function getCompetitionModels(
  competitionId: number,
  userId: number,
  token?: string
) {
  return getCompetitionModelsUseCase.execute(competitionId, userId, token);
}

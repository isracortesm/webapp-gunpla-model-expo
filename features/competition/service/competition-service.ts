import { GetCompetitionsUseCase } from "@/domain/usecases/competition/get-competitions-usecase";
import { RegisterCompetitionModelUseCase } from "@/domain/usecases/competition/register-competition-model-usecase";
import { DeleteCompetitionModelUseCase } from "@/domain/usecases/competition/delete-competition-model-usecase";
import { GetCompetitionModelsUseCase } from "@/domain/usecases/competition/get-competition-models-usecase";
import { GetCompetitionModelsByActivityUseCase } from "@/domain/usecases/competition/get-competition-models-by-activity-usecase";
import { GetCompetitionByActivityUseCase } from "@/domain/usecases/competition/get-competition-by-activity-usecase";
import { GetCompetitionResultUseCase } from "@/domain/usecases/competition/get-competition-result-usecase";
import { CreateCompetitionResultUseCase } from "@/domain/usecases/competition/create-competition-result-usecase";
import { GetCompetitionEvaluationsByResultAndReviewerUseCase } from "@/domain/usecases/competition/get-competition-evaluations-by-result-and-reviewer-usecase";
import { CompetitionRepositoryImpl } from "@/data/repositories/competition/competition-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new CompetitionRepositoryImpl(httpService);
const getCompetitionsUseCase = new GetCompetitionsUseCase(repository);
const registerCompetitionModelUseCase = new RegisterCompetitionModelUseCase(repository);
const deleteCompetitionModelUseCase = new DeleteCompetitionModelUseCase(repository);
const getCompetitionModelsUseCase = new GetCompetitionModelsUseCase(repository);
const getCompetitionModelsByActivityUseCase = new GetCompetitionModelsByActivityUseCase(repository);
const getCompetitionByActivityUseCase = new GetCompetitionByActivityUseCase(repository);
const getCompetitionResultUseCase = new GetCompetitionResultUseCase(repository);
const createCompetitionResultUseCase = new CreateCompetitionResultUseCase(repository);
const getCompetitionEvaluationsByResultAndReviewerUseCase = new GetCompetitionEvaluationsByResultAndReviewerUseCase(repository);

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

export async function getCompetitionModelsByActivity(
  activityDocumentId: string,
  token?: string
) {
  return getCompetitionModelsByActivityUseCase.execute(activityDocumentId, token);
}

export async function getCompetitionByActivity(
  activityDocumentId: string,
  token?: string
) {
  return getCompetitionByActivityUseCase.execute(activityDocumentId, token);
}

export async function getCompetitionResult(
  competitionDocumentId: string,
  modelDocumentId: string,
  token?: string
) {
  return getCompetitionResultUseCase.execute(competitionDocumentId, modelDocumentId, token);
}

export async function createCompetitionResult(
  data: { competition: string; model: string; order?: number; totalPoints?: number },
  token?: string
) {
  return createCompetitionResultUseCase.execute(data, token);
}

export async function getCompetitionEvaluationsByResultAndReviewer(
  resultDocumentId: string,
  reviewerDocumentId: string,
  token?: string
) {
  return getCompetitionEvaluationsByResultAndReviewerUseCase.execute(resultDocumentId, reviewerDocumentId, token);
}

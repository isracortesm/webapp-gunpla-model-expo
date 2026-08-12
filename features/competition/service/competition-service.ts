import { GetCompetitionsUseCase } from "@/domain/usecases/competition/get-competitions-usecase";
import { RegisterCompetitionModelUseCase } from "@/domain/usecases/competition/register-competition-model-usecase";
import { DeleteCompetitionModelUseCase } from "@/domain/usecases/competition/delete-competition-model-usecase";
import { GetCompetitionModelsUseCase } from "@/domain/usecases/competition/get-competition-models-usecase";
import { GetCompetitionModelsByActivityUseCase } from "@/domain/usecases/competition/get-competition-models-by-activity-usecase";
import { GetCompetitionByActivityUseCase } from "@/domain/usecases/competition/get-competition-by-activity-usecase";
import { GetCompetitionResultUseCase } from "@/domain/usecases/competition/get-competition-result-usecase";
import { GetCompetitionResultByModelUseCase } from "@/domain/usecases/competition/get-competition-result-by-model-usecase";
import { GetCompetitionResultsByCompetitionUseCase } from "@/domain/usecases/competition/get-competition-results-by-competition-usecase";
import { CreateCompetitionResultUseCase } from "@/domain/usecases/competition/create-competition-result-usecase";
import { GetCompetitionEvaluationsByResultAndReviewerUseCase } from "@/domain/usecases/competition/get-competition-evaluations-by-result-and-reviewer-usecase";
import { GetCompetitionEvaluationsByResultUseCase } from "@/domain/usecases/competition/get-competition-evaluations-by-result-usecase";
import { CreateCompetitionEvaluationUseCase } from "@/domain/usecases/competition/create-competition-evaluation-usecase";
import { UpdateCompetitionEvaluationUseCase } from "@/domain/usecases/competition/update-competition-evaluation-usecase";
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
const getCompetitionResultByModelUseCase = new GetCompetitionResultByModelUseCase(repository);
const getCompetitionResultsByCompetitionUseCase = new GetCompetitionResultsByCompetitionUseCase(repository);
const createCompetitionResultUseCase = new CreateCompetitionResultUseCase(repository);
const getCompetitionEvaluationsByResultAndReviewerUseCase = new GetCompetitionEvaluationsByResultAndReviewerUseCase(repository);
const getCompetitionEvaluationsByResultUseCase = new GetCompetitionEvaluationsByResultUseCase(repository);
const createCompetitionEvaluationUseCase = new CreateCompetitionEvaluationUseCase(repository);
const updateCompetitionEvaluationUseCase = new UpdateCompetitionEvaluationUseCase(repository);

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

export async function getCompetitionResultByModel(
  competitionDocumentId: string,
  modelDocumentId: string,
  token?: string
) {
  return getCompetitionResultByModelUseCase.execute(competitionDocumentId, modelDocumentId, token);
}

export async function getCompetitionResultsByCompetition(
  competitionDocumentId: string,
  token?: string
) {
  return getCompetitionResultsByCompetitionUseCase.execute(competitionDocumentId, token);
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

export async function getCompetitionEvaluationsByResult(
  resultDocumentId: string,
  token?: string
) {
  return getCompetitionEvaluationsByResultUseCase.execute(resultDocumentId, token);
}

export async function createCompetitionEvaluation(
  data: { name: string; criteria: string; points: number; comments?: string; result: string; reviewer: string },
  token?: string
) {
  return createCompetitionEvaluationUseCase.execute(data, token);
}

export async function updateCompetitionEvaluation(
  documentId: string,
  data: { points: number; comments?: string },
  token?: string
) {
  return updateCompetitionEvaluationUseCase.execute(documentId, data, token);
}

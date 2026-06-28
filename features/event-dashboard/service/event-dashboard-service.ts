import { GetEventUseCase } from "@/domain/usecases/event-dashboard/get-event-usecase";
import { GetEventNewsUseCase } from "@/domain/usecases/event-dashboard/get-event-news-usecase";
import { GetEventActivitiesUseCase } from "@/domain/usecases/event-dashboard/get-event-activities-usecase";
import { GetNewsByDocumentIdUseCase } from "@/domain/usecases/event-dashboard/get-news-by-document-id-usecase";
import { GetActivityByDocumentIdUseCase } from "@/domain/usecases/event-dashboard/get-activity-by-document-id-usecase";
import { RegisterActivityParticipantUseCase } from "@/domain/usecases/event-dashboard/register-activity-participant-usecase";
import { DeleteActivityParticipantUseCase } from "@/domain/usecases/event-dashboard/delete-activity-participant-usecase";
import { CheckActivityRegistrationUseCase } from "@/domain/usecases/event-dashboard/check-activity-registration-usecase";
import { EventDashboardRepositoryImpl } from "@/data/repositories/event-dashboard/event-dashboard-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new EventDashboardRepositoryImpl(httpService);
const getEventUseCase = new GetEventUseCase(repository);
const getEventNewsUseCase = new GetEventNewsUseCase(repository);
const getEventActivitiesUseCase = new GetEventActivitiesUseCase(repository);
const getNewsByDocumentIdUseCase = new GetNewsByDocumentIdUseCase(repository);
const getActivityByDocumentIdUseCase = new GetActivityByDocumentIdUseCase(repository);
const registerActivityParticipantUseCase = new RegisterActivityParticipantUseCase(repository);
const deleteActivityParticipantUseCase = new DeleteActivityParticipantUseCase(repository);
const checkActivityRegistrationUseCase = new CheckActivityRegistrationUseCase(repository);

export async function getEvent(eventCode: string) {
  return getEventUseCase.execute(eventCode);
}

export async function getEventNews(
  eventId: number,
  page: number,
  pageSize: number
) {
  return getEventNewsUseCase.execute(eventId, { page, pageSize });
}

export async function getEventActivities(
  eventId: number,
  page: number,
  pageSize: number
) {
  return getEventActivitiesUseCase.execute(eventId, { page, pageSize });
}

export async function getNewsByDocumentId(documentId: string) {
  return getNewsByDocumentIdUseCase.execute(documentId);
}

export async function getActivityByDocumentId(documentId: string) {
  return getActivityByDocumentIdUseCase.execute(documentId);
}

export async function registerActivityParticipant(activityId: string, userId: string) {
  return registerActivityParticipantUseCase.execute(activityId, userId);
}

export async function deleteActivityParticipant(documentId: string) {
  return deleteActivityParticipantUseCase.execute(documentId);
}

export async function checkActivityRegistration(activityId: number, userId: number): Promise<{ registered: boolean; participantDocumentId: string | null }> {
  return checkActivityRegistrationUseCase.execute(activityId, userId);
}
import { GetEventUseCase } from "@/domain/usecases/event-dashboard/get-event-usecase";
import { GetEventNewsUseCase } from "@/domain/usecases/event-dashboard/get-event-news-usecase";
import { GetEventActivitiesUseCase } from "@/domain/usecases/event-dashboard/get-event-activities-usecase";
import { EventDashboardRepositoryImpl } from "@/data/repositories/event-dashboard/event-dashboard-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new EventDashboardRepositoryImpl(httpService);
const getEventUseCase = new GetEventUseCase(repository);
const getEventNewsUseCase = new GetEventNewsUseCase(repository);
const getEventActivitiesUseCase = new GetEventActivitiesUseCase(repository);

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
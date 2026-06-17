import { GetEventUseCase } from "@/domain/usecases/event-dashboard/get-event-usecase";
import { EventDashboardRepositoryImpl } from "@/data/repositories/event-dashboard/event-dashboard-repository-impl";
import { HttpService } from "@/data/services/http-client";

const httpService = new HttpService();
const repository = new EventDashboardRepositoryImpl(httpService);
const getEventUseCase = new GetEventUseCase(repository);

export async function getEvent(
  eventCode: string,
) {
  return getEventUseCase.execute(eventCode);
}
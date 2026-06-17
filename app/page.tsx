import MainEventCard from "@/components/ui/cards/MainEventCard";
import { EventEntity } from "@/domain/entities/event-dashboard/entity";
import { GetEventUseCase } from "@/domain/usecases/event-dashboard/get-event-usecase";
import { EventDashboardRepositoryImpl } from "@/data/repositories/event-dashboard/event-dashboard-repository-impl";
import { HttpService } from "@/data/services/http-client";

export default async function Home() {
  const httpService = new HttpService();
  const repository = new EventDashboardRepositoryImpl(httpService);
  const useCase = new GetEventUseCase(repository);
  
  // Replace with actual event code from URL params or context
  const eventCode = "HMKGME26";
  let event: EventEntity | null = null;

  try {
    event = await useCase.execute(eventCode);
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MainEventCard
        event={event}
        socialNetworks={[
          { type: "facebook", name: "Facebook", url: "https://www.facebook.com/GundamMexico/" },
          { type: "web", name: "Website", url: "https://hobbymk.com/" },
        ]}
      />
    </div>
  );
}

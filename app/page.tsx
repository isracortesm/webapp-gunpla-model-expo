import MainEventCard from "@/components/ui/cards/MainEventCard";
import { EventEntity } from "@/domain/entities/event-dashboard/entity";
import { getEvent } from "@/features/event-dashboard/service/event-dashboard-service";


export default async function Home() {
  const eventCode = "HMKGME26";
  let event: EventEntity | null = null;
      event = await getEvent(eventCode);

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MainEventCard
        event={event}/>
    </div>
  );
}

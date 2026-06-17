import MainEventCard from "@/components/ui/cards/MainEventCard";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MainEventCard
                title="Event Title"
                subtitle="Event Subtitle"
                imageUrl="https://static.wikia.nocookie.net/philippinetelevision/images/c/ce/16x9_by_Pengo.svg.png/revision/latest?cb=20241119234704"
                category="Category Name"
                isPaid={true}
                description="# Description\nSome **markdown** text."
                socialNetworks={[
                  { type: "facebook", name: "Facebook", url: "https://www.facebook.com/GundamMexico/" },
                  { type: "web", name: "Website", url: "https://hobbymk.com/" },
                ]}
              />
    </div>
  );
}

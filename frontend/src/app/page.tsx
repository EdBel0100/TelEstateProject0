import PublicNavbar from "@/components/devui/PublicNavbar";
import Landing from "./(public)/landing/page";

export default function Home() {
  return (
    <div className="h-full w-full">
      <PublicNavbar />
      <main className={`h-full flex w-full flex-col`}>
        <Landing />
      </main>
    </div>
  );
}

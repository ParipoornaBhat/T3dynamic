import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import HomePage from "./home/page";

export default async function Home() {
  const session = await auth(); // Fetch session information

  return (
    <HydrateClient>
      <HomePage session={session} />
    </HydrateClient>
  );
}

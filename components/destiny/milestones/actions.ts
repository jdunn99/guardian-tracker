import { $http, getManifest } from "@/lib/bungie";
import { getPublicMilestones } from "bungie-api-ts/destiny2";

// I was going to parse on the server but for some reason getting an error fetching the manifest from server components
export async function getMilestones() {
  const { Response } = await getPublicMilestones($http);

  return Response;
}

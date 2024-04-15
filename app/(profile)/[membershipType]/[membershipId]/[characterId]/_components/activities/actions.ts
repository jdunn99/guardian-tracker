import { $http } from "@/lib/bungie";
import { getPostGameCarnageReport } from "bungie-api-ts/destiny2";

export async function getPGCR(activityId: string) {
  const { Response } = await getPostGameCarnageReport($http, { activityId });

  if (!Response) {
    throw new Error("Something went wrong fetching the PGCR");
  }

  return Response;
}

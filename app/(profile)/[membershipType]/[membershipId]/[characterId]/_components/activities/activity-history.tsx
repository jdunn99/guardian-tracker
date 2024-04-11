import { $http, getManifest } from "@/lib/bungie";
import {
  GetActivityHistoryParams,
  getActivityHistory,
} from "bungie-api-ts/destiny2";
import { ActivitiesTable } from "./table";

/**
 * Gets the recent activities for a character and parses the Response
 */
export async function getRecentActivities(params: GetActivityHistoryParams) {
  const { Response } = await getActivityHistory($http, params);

  if (!Response) {
    throw new Error("Something went wrong fetching the character's activities");
  }

  return Response.activities;
}

export async function ActivityHistory(params: GetActivityHistoryParams) {
  const { DestinyActivityDefinition, DestinyActivityModeDefinition } =
    await getManifest([
      "DestinyActivityDefinition",
      "DestinyActivityModeDefinition",
    ]);

  return (
    <ActivitiesTable
      activityManifest={DestinyActivityDefinition}
      activityModeManifest={DestinyActivityModeDefinition}
      {...params}
    />
  );
}

import { $http, getManifest } from "@/lib/bungie";
import {
  GetActivityHistoryParams,
  getActivityHistory,
} from "bungie-api-ts/destiny2";
import { ActivitiesTable } from "./table";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-0">
      <h5 className="text-xs uppercase text-yellow-500 font-bold p-4">
        Recent Activity
      </h5>
      <ActivitiesTable {...params} />
    </Card>
  );
}

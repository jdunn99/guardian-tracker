// Since we have to deal with pagination and whatnot, we are going to fetch strictly on the client
"use client";

import { ScrollCard } from "@/components/ui/card";
import useSWR from "swr";
import {
  DestinyActivityDefinition,
  DestinyActivityHistoryResults,
  DestinyActivityModeCategory,
  DestinyActivityModeDefinition,
  DestinyActivityModeType,
  DestinyActivityTypeDefinition,
  DestinyHistoricalStatsPeriodGroup,
  GetActivityHistoryParams,
} from "bungie-api-ts/destiny2";
import { getRecentActivities } from "./activity-history";
import Image from "next/image";

// type ParsedActivity = {
//   period: string;
//   name: string;
//   mode: DestinyActivityModeDefinition

// }

// const columns: ColumnDef<DestinyHistoricalStatsPeriodGroup[]> = [
//   {
//     accsorKey: "period",
//     header: ""
//   },
//   {
//     accessorKey: "activityDetails"
//   }
// ]

function ActivityType({ type }: { type: DestinyActivityModeCategory }) {
  switch (type) {
    case 1:
      return <p className="text-xs font-bold text-blue-300">PVE</p>;
    case 2:
      return <p className="text-xs font-bold text-red-500">PVP</p>;
    case 3:
      return (
        <p className="text-xs font-bold text-teal-500">PVE - Competitive</p>
      );
    default:
      return null;
  }
}

interface ActivitiesTableProps extends GetActivityHistoryParams {
  activityManifest: Record<number, DestinyActivityDefinition>;
  activityModeManifest: Record<number, DestinyActivityModeDefinition>;
}

export function ActivitiesTable({
  activityManifest,
  activityModeManifest,
  ...params
}: ActivitiesTableProps) {
  const { data, error } = useSWR(params.characterId + "/activities", () =>
    getRecentActivities(params)
  );

  if (!data) {
    return null;
  }

  if (error) {
    throw new Error("Something went wrong fetching the data");
  }
  console.log(DestinyActivityModeType[1]);

  return (
    <ScrollCard>
      <div className="space-y-2">
        {data.map((activity) => {
          const activityDefintion =
            activityManifest[activity.activityDetails.directorActivityHash];

          const referenceActivity =
            activityManifest[activity.activityDetails.referenceId];

          const activityMode = activityDefintion.directActivityModeHash
            ? activityModeManifest[activityDefintion.directActivityModeHash]
            : undefined;

          return (
            <div
              className="flex bg-slate-800 w-full gap-4 items-center  p-4 rounded"
              key={activity.period}
            >
              {typeof activityMode !== "undefined" ? (
                <Image
                  src={`https://bungie.net${activityMode.displayProperties.icon}`}
                  width={24}
                  height={24}
                  alt="icon"
                />
              ) : null}

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <p className="text-white font-bold">
                    {activityDefintion.displayProperties.name}
                  </p>
                  {typeof activityMode !== "undefined" ? (
                    <p className="text-yellow-500 text-xs">
                      <ActivityType type={activityMode.activityModeCategory} />
                    </p>
                  ) : null}
                </div>
                {referenceActivity.displayProperties.name !==
                activityDefintion.displayProperties.name ? (
                  <p className="text-sm text-slate-200 font-medium">
                    {referenceActivity.displayProperties.name}
                  </p>
                ) : null}
                <p className="text-xs text-slate-400">
                  {new Date(activity.period).toDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollCard>
  );
}

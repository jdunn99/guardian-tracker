"use client";

import {
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
  DestinyHistoricalStatsPeriodGroup,
} from "bungie-api-ts/destiny2";
import useSWR from "swr";
import { getPGCR } from "../actions";
import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PGCRTeams } from "./pgcr-teams";
import { PGCREntry } from "./pgcr-entry";
import { PGCRPvE } from "./pgcr-pve";

interface PGCRProps {
  activity: DestinyHistoricalStatsPeriodGroup;
  activityDefinition: DestinyActivityDefinition;
  activityType: DestinyActivityTypeDefinition;
}

export function PostGameCarnageReport({
  activity,
  activityDefinition,
  activityType,
}: PGCRProps) {
  const { data } = useSWR(activity.period, () =>
    getPGCR(activity.activityDetails.instanceId)
  );

  if (!data) {
    return null;
  }

  return (
    <React.Fragment>
      <div
        className={cn(
          "w-full h-64 relative bg-gradient-to-b from-slate-800 to-black",
          activity.values.standing
            ? activity.values.standing.basic.displayValue === "Victory"
              ? "to-green-900"
              : "to-red-900"
            : "to-black"
        )}
      >
        <div
          className="w-full h-full absolute opacity-40"
          style={{
            backgroundImage: `url("https://bungie.net${activityDefinition.pgcrImage}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute bottom-8 left-8">
          <Image
            src={`https://bungie.net${activityType.displayProperties.icon}`}
            className="pb-2"
            width={48}
            height={48}
            alt="icon"
          />
          <h5 className="text-xs font-bold text-yellow-500 uppercase">
            {activityType.displayProperties.name}
          </h5>
          <h1 className="text-3xl text-white font-bold">
            {activityDefinition.displayProperties.name}
          </h1>
          <p className="text-slate-200 font-medium">{activity.period}</p>
          <p className="text-sm text-slate-400">
            {activity.values.timePlayedSeconds.basic.displayValue}
            <span
              className={cn(
                activity.values.completed.basic.value === 0
                  ? "text-red-500 font-bold pl-2"
                  : "text-green-500"
              )}
            >
              {activity.values.completed.basic.value === 0 ? " Incomplete" : ""}
            </span>
          </p>
        </div>
      </div>
      <div className="">
        {data.teams.length > 0 ? (
          <PGCRTeams teams={data.teams} entries={data.entries} />
        ) : (
          <PGCRPvE entries={data.entries} />
        )}
      </div>
    </React.Fragment>
  );
}

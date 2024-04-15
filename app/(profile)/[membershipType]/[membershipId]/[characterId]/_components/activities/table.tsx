// Since we have to deal with pagination and whatnot, we are going to fetch strictly on the client
"use client";

import { ScrollCard } from "@/components/ui/card";
import useSWR from "swr";
import { GetActivityHistoryParams } from "bungie-api-ts/destiny2";
import { getRecentActivities } from "./activity-history";
import { useManifest } from "@/lib/manifest/useManifest";

import React from "react";
import { ActivityItem } from "./activity-item";

interface ActivitiesTableProps extends GetActivityHistoryParams {}

export function ActivitiesTable({ ...params }: ActivitiesTableProps) {
  const { data, error } = useSWR(params.characterId + "/activities", () =>
    getRecentActivities(params)
  );

  const manifest = useManifest();

  if (!data || !manifest) {
    return null;
  }

  if (error) {
    throw new Error("Something went wrong fetching the data");
  }

  return (
    <ScrollCard>
      <div className="py-2">
        {data.map((activity) => (
          <ActivityItem key={activity.period} {...activity} />
        ))}
      </div>
    </ScrollCard>
  );
}

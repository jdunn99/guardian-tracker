"use client";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";
import React from "react";
import { FilterItem } from "./filter-item";
import { SelectItem } from "@radix-ui/react-select";

export function ActivityModeFilter({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();

  const data = React.useMemo(() => {
    if (!manifest) {
      return [];
    }

    const results: any = {};
    for (const activity of aggregateActivities.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activity.activityHash];

      if (
        !destinyActivity ||
        destinyActivity.displayProperties.name === "" ||
        !destinyActivity.directActivityModeHash
      ) {
        continue;
      }

      const activityType =
        manifest.DestinyActivityModeDefinition[
          destinyActivity.directActivityModeHash
        ];

      if (activityType.displayProperties.name === "") {
        continue;
      }

      results[activityType.displayProperties.name] = activityType;
    }

    return Object.values(results) as any[];
  }, [manifest, aggregateActivities]);

  return <FilterItem label="Activity Mode" field="activityMode" data={data} />;
}

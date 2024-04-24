"use client";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";
import React from "react";
import { FilterItem } from "./filter-item";
import { SelectItem } from "@radix-ui/react-select";
import { useFilters } from "./filterContext";

export function ActivityFilter({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();
  const { filters } = useFilters();

  const data = React.useMemo(() => {
    if (!manifest) {
      return [];
    }

    const result = [];
    for (const activity of aggregateActivities.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activity.activityHash];

      if (
        !destinyActivity ||
        destinyActivity.displayProperties.name === "" ||
        !destinyActivity.activityModeHashes
      ) {
        continue;
      }

      if (filters.activityMode) {
        if (
          !destinyActivity.activityModeHashes.includes(
            parseInt(filters.activityMode)
          )
        ) {
          continue;
        }
      }

      if (destinyActivity && destinyActivity.displayProperties.name !== "") {
        result.push(destinyActivity);
      }
    }

    return result;
  }, [manifest, filters.activityMode, aggregateActivities]);

  return <FilterItem label="Activity" field="activity" data={data} />;
}

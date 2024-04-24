"use client";

import React from "react";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";
import { ActivityFilter } from "../filter/activity-filter";
import { ActivityModeFilter } from "../filter/activity-mode-filter";

export function ActivityFilters({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  return (
    <div className="space-y-4 p-2">
      <ActivityModeFilter aggregateActivities={aggregateActivities} />
      <ActivityFilter aggregateActivities={aggregateActivities} />
    </div>
  );
}

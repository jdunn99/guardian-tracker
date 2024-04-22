"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Bar,
} from "recharts";
import { useFilters } from "../filter/filterContext";

export function TestBarChart({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();
  const { filters } = useFilters();

  const aggregateData = React.useMemo(() => {
    const result: any[] = [];

    const q: any = {};

    if (!manifest) {
      return [] as any[];
    }

    for (const activity of aggregateActivities.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activity.activityHash];

      if (
        !destinyActivity ||
        !destinyActivity.activityModeHashes ||
        destinyActivity.displayProperties.name === "" ||
        destinyActivity.displayProperties.name === "???"
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

      if (q[destinyActivity.displayProperties.name]) {
        const p = q[destinyActivity.displayProperties.name];
        q[destinyActivity.displayProperties.name] = {
          ...p,
          completions:
            p.completions + activity.values.activityCompletions.basic.value,
        };
      } else {
        q[destinyActivity.displayProperties.name] = {
          name: destinyActivity.displayProperties.name,
          completions: activity.values.activityCompletions.basic.value,
        };
      }
    }

    return q;
  }, [manifest, aggregateActivities, filters]);

  return (
    <div className="w-full lg:col-span-4 h-96">
      <p className="text-xs text-slate-400">
        Click on a Bar to Filter by Activity
      </p>
      <ResponsiveContainer>
        <BarChart
          data={Object.values(aggregateData)}
          margin={{ top: 20, bottom: 40 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600" /> */}
          <XAxis
            // hide={Object.values(aggregateData).length > 20}
            dataKey="name"
            className="text-xs"
            // textAnchor="end"
            tick={{
              display:
                Object.values(aggregateData).length > 20 ? "none" : "block",
            }}
          >
            <Label
              value="Activity"
              offset={10}
              position={"bottom"}
              fill="white"
            />
          </XAxis>
          <YAxis className="text-[10px]">
            <Label
              value="Completions"
              fill="white"
              angle={-90}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip cursor={{ className: "fill-slate-800/50" }} />
          <Bar dataKey="completions" className="fill-slate-700" />
          {/* <Bar dataKey="wins" className="fill-slate-600 " /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

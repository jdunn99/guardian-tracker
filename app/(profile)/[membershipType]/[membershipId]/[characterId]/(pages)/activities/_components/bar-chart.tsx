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
  Cell,
} from "recharts";
import { useFilterDispatch, useFilters } from "../filter/filterContext";
import { cn } from "@/lib/utils";
import { ChartCustomTooltip } from "./charts/chart-custom-tooltip";

export function TestBarChart({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();
  const { filters } = useFilters();
  const dispatch = useFilterDispatch();

  const isSelected = React.useCallback(
    (name: string) => {
      if (!manifest || !filters.activity) {
        return false;
      }

      const filteredActivity =
        manifest.DestinyActivityDefinition[parseInt(filters.activity)];

      return filteredActivity.displayProperties.name === name;
    },
    [manifest, filters.activity]
  );

  const aggregateData = React.useMemo(() => {
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
          hash: destinyActivity.hash,
        };
      }
    }

    return Object.values(q);
  }, [manifest, aggregateActivities, filters]);

  return (
    <div className="w-full h-96 p-2 xl:col-span-4">
      <p className="text-xs text-slate-400">
        Click on a Bar to Filter by Activity
      </p>
      <ResponsiveContainer>
        <BarChart
          data={aggregateData}
          margin={{ top: 20, bottom: 40, right: 30 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600" /> */}
          <XAxis
            dataKey="name"
            className="text-xs"
            // textAnchor="end"
            tick={{
              display: aggregateData.length > 20 ? "none" : "block",
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
          <Tooltip
            cursor={{ className: "fill-slate-800/50" }}
            content={(props) => (
              <ChartCustomTooltip {...props} secondLabel="Completions" />
            )}
          />
          <Bar
            dataKey="completions"
            className="fill-slate-700"
            onClick={(data) => {
              if (filters.activity === data.hash) {
                // setSelected(0);
                dispatch!({
                  type: "Remove filter",
                  payload: { field: "activity" },
                });
              } else {
                // setSelected(data.hash);

                dispatch!({
                  type: "Add filter",
                  payload: { field: "activity", value: data.hash },
                });
              }
            }}
          >
            {aggregateData.map((data, index) => (
              <Cell
                key={`cell-${index}`}
                className={cn(isSelected(data.name) ? "fill-yellow-500" : "")}
              />
            ))}
          </Bar>
          {/* <Bar dataKey="wins" className="fill-slate-600 " /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

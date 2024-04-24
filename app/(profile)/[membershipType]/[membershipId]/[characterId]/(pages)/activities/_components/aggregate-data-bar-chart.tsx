"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyAggregateActivityResults } from "bungie-api-ts/destiny2";
import { useFilterDispatch, useFilters } from "../filter/filterContext";
import { cn } from "@/lib/utils";
import { ChartCustomTooltip } from "./charts/chart-custom-tooltip";

export function AggregateDataBarChart({
  aggregateActivities,
}: {
  aggregateActivities: DestinyAggregateActivityResults;
}) {
  const manifest = useManifest();
  const dispatch = useFilterDispatch();
  const { filters } = useFilters();

  const [selected, setSelected] = React.useState<number>();

  console.log(filters.activityMode);
  React.useEffect(() => {
    if (filters.activityMode && parseInt(filters.activityMode) !== selected) {
      setSelected(parseInt(filters.activityMode));
    }

    if (!filters.activityMode) {
      setSelected(0);
    }
  }, [filters.activityMode, selected]);

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

      if (q[activityType.displayProperties.name]) {
        const p = q[activityType.displayProperties.name];
        q[activityType.displayProperties.name] = {
          ...p,
          completions:
            p.completions + activity.values.activityCompletions.basic.value,
          wins: p.wins + activity.values.activityWins.basic.value,
          hash: activityType.hash,
        };
      } else {
        q[activityType.displayProperties.name] = {
          name: activityType.displayProperties.name,
          completions: activity.values.activityCompletions.basic.value,
          wins: activity.values.activityWins.basic.value,
          hash: activityType.hash,
        };
      }
    }

    return Object.values(q);
  }, [manifest, aggregateActivities]);

  return (
    <div className="w-full p-2 h-96 xl:col-span-2">
      <p className="text-xs text-slate-400">
        Click on a Bar to Filter by Activity Type
      </p>
      <ResponsiveContainer>
        <BarChart
          data={aggregateData}
          margin={{ top: 20, bottom: 40, right: 50 }}
          layout="vertical"
        >
          {/* <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600" /> */}
          <XAxis type="number" className="text-xs">
            <Label
              value="Completions"
              offset={10}
              position={"bottom"}
              fill="white"
            />
          </XAxis>
          <YAxis
            type="category"
            dataKey="name"
            interval={0}
            width={180}
            className="text-[10px]"
            tick={{ fill: "#dedede", dx: -5 }}
          >
            <Label
              value="Activity Type"
              fill="white"
              angle={-90}
              offset={30}
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
              console.log(selected, data.hash);

              if (selected === data.hash) {
                setSelected(0);
                dispatch!({
                  type: "Remove filter",
                  payload: { field: "activityMode" },
                });
              } else {
                setSelected(data.hash);

                dispatch!({
                  type: "Add filter",
                  payload: { field: "activityMode", value: data.hash },
                });
              }
            }}
          >
            {aggregateData.map((data, index) => (
              <Cell
                key={`cell-${index}`}
                className={cn(selected === data.hash ? "fill-yellow-500" : "")}
              />
            ))}
          </Bar>
          {/* <Bar dataKey="wins" className="fill-slate-600 " /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

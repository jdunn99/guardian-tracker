"use client";

import useSWR from "swr";
import { Props } from "../../../../../page";
import { getRecentActivities } from "../../../../../_components/activities/activity-history";
import { useFilters } from "../../../filter/filterContext";
import { useManifest } from "@/lib/manifest/useManifest";
import { ActivitiesLineChart } from "./activities-line-chart";
import { useActivities } from "../../../_hooks/useActivities";

export function LineChartsContainer({ params }: Props) {
  const data = useActivities({ params });

  if (!data) {
    return (
      <div className="bg-slate-800/50 h-96 flex items-center justify-center flex-col w-full xl:col-span-3">
        <p className="text-xs text-slate-400 font-light">Loading</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-96 xl:col-span-3">
      <p className="text-xs text-slate-400">
        Click on a Dot to see a Post-Game Carnage Report
      </p>
      <div className="grid grid-rows-2 w-full h-full ">
        <ActivitiesLineChart
          data={data}
          dataKey="values.killsDeathsAssists.basic.value"
          label="KD/A Ratio"
        />

        <ActivitiesLineChart
          label="Score"
          data={data}
          dataKey="values.score.basic.value"
        />
      </div>
    </div>
  );
}

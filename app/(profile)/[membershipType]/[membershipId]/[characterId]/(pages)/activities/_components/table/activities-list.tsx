"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import { ActivityItem } from "../../../../_components/activities/activity-item";
import { Props } from "../../../../page";
import { useActivities } from "../../_hooks/useActivities";
import { useFilters } from "../../filter/filterContext";

export function ActivitiesList({ params }: Props) {
  const data = useActivities({ params });
  const { filters } = useFilters();
  const manifest = useManifest();

  if (!data || !manifest) {
    return (
      <div className="w-full h-[calc(100vh-432px)] bg-slate-800/50 flex flex-col justify-center items-center">
        <p className="text-slate-400 text-xs text-light">Loading</p>
      </div>
    );
  }

  return (
    <div className="h-full ">
      <div className="w-full sticky top-0 z-99 bg-slate-800 border-b border-slate-700/50">
        <h1 className="text-white p-3">Recent Activities</h1>
      </div>
      {data.map((activity) => (
        <ActivityItem key={activity.period} {...activity} />
      ))}

      {data.length === 0 ? (
        <span>
          {filters.activityMode
            ? filters.activity
              ? `No recent activities found for ${manifest.DestinyActivityDefinition[parseInt(filters.activity)].displayProperties.name}`
              : `No recent activities found for ${manifest.DestinyActivityModeDefinition[parseInt(filters.activityMode)].displayProperties.name}`
            : "No activities found"}
        </span>
      ) : null}
    </div>
  );
}

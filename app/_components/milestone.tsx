"use client";

import { HoverItem } from "@/components/hover-item";
import { WeeklyActivity } from "./milestones";

export function Milestone(activity: WeeklyActivity) {
  return (
    <div className="flex items-start gap-2">
      <img
        src={`https://bungie.net/${activity.image}`}
        className="w-24 shadow-lg h-24 border border-slate-700"
      />
      <div className="space-y-1">
        <h1 className="font-bold text-yellow-500 text-xs">{activity.name}</h1>
        <h1 className="font-semibold text-slate-50">{activity.activityName}</h1>
        <div className="grid gap-1 py-2">
          {activity.rewards.map((reward) => (
            <HoverItem
              key={crypto.randomUUID()}
              {...reward.displayProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

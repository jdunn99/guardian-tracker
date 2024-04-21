"use client";
import { useMilestones } from "@/components/destiny/milestones/useMilestones";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DestinyActivity, DestinyMilestone } from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";

interface WeeklyShortMilestonesProps {
  characterActivities: DestinyActivity[];
}

// Raid, Dungeon, Nightfall - Maybe add a PVP activity if an event (IB / Trials) is active
export function WeeklyShortMilestones({
  characterActivities,
}: WeeklyShortMilestonesProps) {
  const milestones = useMilestones();

  const isChecked = React.useCallback(
    (hash: number) => {
      const activity = characterActivities.find(
        (activity) => activity.activityHash === hash
      );

      if (!activity) {
        return false;
      }

      return activity.isCompleted;
    },

    [characterActivities]
  );

  if (!milestones) {
    return null;
  }

  return (
    <div className={`grid sm:grid-cols-3 gap-2`}>
      {milestones.map((milestone) => (
        <Card key={milestone.hash}>
          <h5 className="text-xs uppercase text-yellow-500 font-bold">
            {milestone.challenge}
          </h5>
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={`https://bungie.net${milestone.icon}`}
                width={32}
                height={32}
                alt="icon"
              />
              <h3 className="text-white font-bold text-xl">{milestone.name}</h3>
            </div>
            <Checkbox
              checked={isChecked(milestone.activityHash)}
              disabled
              className="accent-yellow-500 border-slate-700 rounded-none"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

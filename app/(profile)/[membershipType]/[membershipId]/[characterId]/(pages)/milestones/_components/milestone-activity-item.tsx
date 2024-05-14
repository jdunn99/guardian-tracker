import { HoverCard } from "@/components/ui/hover-card";
import { Milestone } from "./milestone-container";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
  TooltipBody,
  TooltipDescription,
  TooltipImage,
} from "@/components/ui/tooltip";
import React from "react";
import Image from "next/image";
import { useManifest } from "@/lib/manifest/useManifest";
import { ActivityModifier } from "@/components/activity-modifier";

interface MilestoneActivityItemProps {
  milestone: Milestone;
}

export function MilestoneActivityItem({
  milestone,
}: MilestoneActivityItemProps) {
  const manifest = useManifest();

  const pgcrImage = React.useMemo(() => {
    if (!manifest) {
      return null;
    }

    const [activity] = milestone.activities;
    return manifest.DestinyActivityDefinition[activity.activityHash].pgcrImage;
  }, [manifest, milestone]);

  const activities = React.useMemo(() => {
    if (!manifest) {
      return null;
    }

    const result = [];

    console.log(milestone.hash);

    for (const activitiy of milestone.activities) {
      const destinyActivity =
        manifest.DestinyActivityDefinition[activitiy.activityHash];

      result.push(destinyActivity);
    }

    return result;
  }, [milestone, manifest]);

  const challenge = React.useMemo(() => {
    if (!manifest) {
      return false;
    }

    for (const activity of milestone.activities) {
      if (
        activity.challengeObjectiveHashes &&
        activity.challengeObjectiveHashes.length > 0
      ) {
        return manifest.DestinyObjectiveDefinition[
          activity.challengeObjectiveHashes[0]
        ];
      }
    }

    return false;
  }, [manifest, milestone]);

  if (!manifest) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="w-full bg-slate-800/30 border border-slate-700/50 px-8 py-4 hover:bg-slate-800/50 transition-all hover:border-yellow-500/30">
          <div className="flex  w-full items-center justify-between gap-4">
            <div>
              <p
                className="text-white cursor-context-menu"
                key={crypto.randomUUID()}
              >
                {milestone.name}
              </p>
              <p className="text-sm text-slate-400 cursor-context-menu">
                {milestone.description}
              </p>
            </div>
            {challenge ? (
              <Image
                src="https://www.bungie.net/common/destiny2_content/icons/a1bb89034105dd291ac7072497771052.png"
                alt=""
                className="p-1 w-8 h-8 bg-slate-900 rounded border border-yellow-500/30"
                width={18}
                height={18}
              />
            ) : null}
          </div>
        </div>
      </HoverCardTrigger>
      <DestinyTooltip>
        <TooltipHeader className="bg-slate-700/30">
          <TooltipTitle>{milestone.name}</TooltipTitle>
          {challenge ? (
            <TooltipDescription>
              {challenge.displayProperties.name}
            </TooltipDescription>
          ) : null}
        </TooltipHeader>
        {pgcrImage ? <TooltipImage src={pgcrImage} /> : null}
        <TooltipBody>
          <div className="space-y-8 py-4">
            {activities
              ? activities.map((activity, index) => (
                  <div className="" key={activity.hash}>
                    <h1 className="text-white font-bold">
                      {activity.displayProperties.name}
                    </h1>
                    <p className="text-slate-300 text-xs">
                      {activity.displayProperties.description}
                    </p>

                    {milestone.activities[index].modifierHashes ? (
                      <div className="pt-2">
                        <h5 className="text-xs font-bold text-yellow-500 uppercase pb-1">
                          modifiers
                        </h5>
                        <div className="flex items-center gap-1 flex-wrap w-full">
                          {milestone.activities[index].modifierHashes.map(
                            (modifier) => (
                              <ActivityModifier
                                key={modifier}
                                {...manifest.DestinyActivityModifierDefinition[
                                  modifier
                                ]}
                              />
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </TooltipBody>
      </DestinyTooltip>
    </HoverCard>
  );
}

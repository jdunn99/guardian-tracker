"use client";

import { HoverCard } from "@/components/ui/hover-card";
import {
  DestinyTooltip,
  TooltipBody,
  TooltipDescription,
  TooltipHeader,
  TooltipTitle,
} from "@/components/ui/tooltip";
import { useManifest } from "@/lib/manifest/useManifest";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  DestinyCharacterProgressionComponent,
  DestinyMilestone,
  DestinyMilestoneQuest,
  DestinyPublicMilestone,
  DestinyQuestStatus,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";

type Activity = {
  challenge?: number;
  modifiers: number[];
  hash: number;
};

type Quest = {
  hash: number;
  status: DestinyQuestStatus;
};

type ParsedMilestone = Record<
  number,
  {
    quests: Quest[];
    activities: Activity[];
  }
>;

// Raid, Dungeon, Crucible, Gambit, Story, Strike, Scored Nightfall Strike

export function Milestones({
  milestones,
  publicMilestones,
}: {
  milestones: Record<number, DestinyMilestone>;
  publicMilestones: Record<number, DestinyPublicMilestone>;
}) {
  const manifest = useManifest();
  const [selected, setSelected] = React.useState<string>("");

  const data = React.useMemo(() => {
    if (!manifest) {
      return null;
    }
    const activityTypes: Record<string, string> = {};
    const q: Record<string, string[]> = {};

    for (const key of Object.keys(publicMilestones)) {
      const milestone = publicMilestones[parseInt(key)];
      const destinyMilestone =
        manifest.DestinyMilestoneDefinition[milestone.milestoneHash];
      if (milestone.activities) {
        for (const activity of milestone.activities) {
          const destinyActivity =
            manifest.DestinyActivityDefinition[activity.activityHash];

          if (
            destinyMilestone.displayProperties.name ===
            "Weekly Ritual Challenge"
          )
            continue;

          if (destinyActivity.directActivityModeHash) {
            const activityType =
              manifest.DestinyActivityModeDefinition[
                destinyActivity.directActivityModeHash
              ];

            activityTypes[activityType.displayProperties.name] =
              activityType.displayProperties.icon;

            if (q[activityType.displayProperties.name]) {
              q[activityType.displayProperties.name] = [
                ...q[activityType.displayProperties.name],
                destinyMilestone.displayProperties.name,
              ];
            } else {
              q[activityType.displayProperties.name] = [
                destinyMilestone.displayProperties.name,
              ];
            }
          }
        }
      }
    }

    return { activityTypes, q };
  }, [manifest, publicMilestones]);

  return (
    <div className="w-full container mx-auto">
      <div className="w-full flex  py-32 gap-4">
        <ul className="flex flex-col gap-1">
          {data &&
            Object.keys(data.activityTypes).map((type) => (
              <li
                key={type}
                className="p-0.5 transition-all border border-transparent hover:border-slate-700"
                onClick={() => setSelected(type)}
              >
                <HoverCard openDelay={300} closeDelay={300}>
                  <HoverCardTrigger asChild>
                    <Image
                      src={`https://bungie.net${data.activityTypes[type]}`}
                      alt=""
                      width={48}
                      height={48}
                      className="border p-1 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                    />
                  </HoverCardTrigger>
                  <DestinyTooltip>
                    <TooltipHeader className="bg-slate-700/30">
                      <TooltipTitle>{type}</TooltipTitle>
                    </TooltipHeader>
                    <TooltipBody>
                      <TooltipDescription>Tis</TooltipDescription>
                    </TooltipBody>
                  </DestinyTooltip>
                </HoverCard>
              </li>
            ))}
        </ul>
        <div className="flex gap-2 w-full p-0.5">
          <div className="grid grid-cols-2 w-full gap-1">
            {selected &&
              data &&
              data.q[selected].map((item) => (
                <p className="text-white" key={crypto.randomUUID()}>
                  {item}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

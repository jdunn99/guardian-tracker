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
import { cn } from "@/lib/utils";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  AllDestinyManifestComponents,
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
  DestinyCharacterProgressionComponent,
  DestinyManifestSlice,
  DestinyMilestone,
  DestinyMilestoneDefinition,
  DestinyMilestoneQuest,
  DestinyPublicMilestone,
  DestinyPublicMilestoneChallengeActivity,
  DestinyQuestStatus,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";

type ParsedMilestone = {
  category: string;
  description: string;
  icon: string;
  activities: DestinyActivityDefinition[];
};

// function parseActivites(
//   manifest: DestinyManifestSlice<(keyof AllDestinyManifestComponents)[]>,
//   activities: DestinyPublicMilestoneChallengeActivity[],
//   destinyMilestone: DestinyMilestoneDefinition
// ) {
//   for (const activity of activities) {
//     const destinyActivity =
//       manifest.DestinyActivityDefinition[activity.activityHash];

//     if (
//       destinyMilestone.displayProperties.name === "Weekly Ritual Challenge" ||
//       !destinyActivity.directActivityModeHash
//     ) {
//       continue;
//     }

//     const activityType =
//       manifest.DestinyActivityModeDefinition[
//         destinyActivity.directActivityModeHash
//       ];

//     activityTypes[activityType.displayProperties.name] =
//       activityType.displayProperties.icon;

//     // if (q[activityType.displayProperties.name]) {
//     //   q[activityType.displayProperties.name] = [
//     //     ...q[activityType.displayProperties.name],
//     //     destinyMilestone.displayProperties.name,
//     //   ];
//     // } else {
//     //   q[activityType.displayProperties.name] = [
//     //     destinyMilestone.displayProperties.name,
//     //   ];
//     // }
//   }
// }

// Raid, Dungeon, Crucible, Gambit, Story, Strike, Scored Nightfall Strike
// TYQTQ18J7JR15T

type Category = {
  description: string;
  icon: string;
};

type Milestone = {
  icon: string;
  name: string;
  description: string;
  activities: DestinyPublicMilestoneChallengeActivity[];
};

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

    const activityTypes: Record<string, Category> = {};
    const milestonesByKey: Record<string, Milestone[]> = {};
    const quests: Milestone[] = [];

    for (const key of Object.keys(publicMilestones)) {
      const milestone = publicMilestones[parseInt(key)];
      const destinyMilestone =
        manifest.DestinyMilestoneDefinition[milestone.milestoneHash];

      let name = "";

      if (milestone.activities) {
        for (const activity of milestone.activities) {
          const destinyActivity =
            manifest.DestinyActivityDefinition[activity.activityHash];

          if (
            destinyMilestone.displayProperties.name ===
              "Weekly Ritual Challenge" ||
            !destinyActivity.directActivityModeHash
          )
            continue;

          const activityType =
            manifest.DestinyActivityModeDefinition[
              destinyActivity.directActivityModeHash
            ];

          name = activityType.displayProperties.name;

          activityTypes[name] = {
            ...activityType.displayProperties,
          };
        }

        if (milestonesByKey[name]) {
          milestonesByKey[name] = [
            ...milestonesByKey[name],
            {
              activities: milestone.activities,
              ...destinyMilestone.displayProperties,
            },
          ];
        } else {
          milestonesByKey[name] = [
            {
              activities: milestone.activities,
              ...destinyMilestone.displayProperties,
            },
          ];
        }
      }

      if (milestone.availableQuests) {
        const [quest] = milestone.availableQuests;

        const destinyQuest =
          manifest.DestinyInventoryItemDefinition[quest.questItemHash];

        quests.push({
          activities: [],
          ...destinyQuest.displayProperties,
        });
      }
    }

    return { activityTypes, milestonesByKey, quests };
  }, [manifest, publicMilestones]);

  return (
    <div className="w-full container mx-auto py-32">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <h5 className="text-xs uppercase text-yellow-500 font-bold pb-4">
            Activities - {selected}
          </h5>
          <div className="flex items-start w-full gap-4">
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
                          src={`https://bungie.net${data.activityTypes[type].icon}`}
                          alt=""
                          width={48}
                          height={48}
                          className={cn(
                            "border p-1  hover:bg-slate-700/50 text-slate-300",
                            selected === type
                              ? "bg-slate-700/50 border-yellow-500/40"
                              : "bg-slate-800/50 border-slate-700"
                          )}
                        />
                      </HoverCardTrigger>
                      <DestinyTooltip>
                        <TooltipHeader className="bg-slate-700/30">
                          <TooltipTitle>{type}</TooltipTitle>
                        </TooltipHeader>
                        <TooltipBody>
                          <TooltipDescription>
                            {data.activityTypes[type].description}
                          </TooltipDescription>
                        </TooltipBody>
                      </DestinyTooltip>
                    </HoverCard>
                  </li>
                ))}
            </ul>
            <div className="grid grid-cols-2 w-full gap-2 ">
              {selected &&
                data &&
                data.milestonesByKey[selected].map((item) => (
                  <div
                    className="w-full bg-slate-800/30 border border-slate-700/50 px-8 py-4"
                    key={crypto.randomUUID()}
                  >
                    <p className="text-white" key={crypto.randomUUID()}>
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <h5 className="text-xs uppercase text-yellow-500 font-bold pb-4">
            Quests
          </h5>
          <div className="flex w-64 flex-wrap gap-2">
            {data &&
              data.quests.map((item) => (
                <Image
                  className="bg-slate-800/50  border-slate-700 border p-1"
                  key={item.name}
                  width={48}
                  height={48}
                  src={`https://bungie.net${item.icon}`}
                  alt=""
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

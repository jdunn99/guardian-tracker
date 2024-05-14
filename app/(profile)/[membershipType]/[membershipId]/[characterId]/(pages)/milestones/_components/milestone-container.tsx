"use client";

import { useManifest } from "@/lib/manifest/useManifest";

import {
  DestinyMilestone,
  DestinyPublicMilestone,
  DestinyPublicMilestoneChallengeActivity,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";
import { ActivitySelect } from "./activity-select";
import { MilestoneActivityItem } from "./milestone-activity-item";
import { MilestoneQuestItem } from "./milestone-quest-item";

// Raid, Dungeon, Crucible, Gambit, Story, Strike, Scored Nightfall Strike
// TYQTQ18J7JR15T

type Category = {
  description: string;
  icon: string;
};

export type Milestone = {
  icon: string;
  name: string;
  description: string;
  activities: DestinyPublicMilestoneChallengeActivity[];
  hash: number;
};

export function Milestones({
  milestones,
  publicMilestones,
}: {
  milestones: Record<number, DestinyMilestone>;
  publicMilestones: Record<number, DestinyPublicMilestone>;
}) {
  const manifest = useManifest();
  const [selected, setSelected] = React.useState<string>("All");

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

      if (
        destinyMilestone.displayProperties.name === "Weekly Ritual Challenge"
      ) {
        continue;
      }

      if (milestone.activities) {
        for (const activity of milestone.activities) {
          const destinyActivity =
            manifest.DestinyActivityDefinition[activity.activityHash];

          if (!destinyActivity.directActivityModeHash) continue;

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
              hash: destinyMilestone.hash,
            },
          ];
        } else {
          milestonesByKey[name] = [
            {
              activities: milestone.activities,
              ...destinyMilestone.displayProperties,
              hash: destinyMilestone.hash,
            },
          ];
        }
      }

      if (milestone.availableQuests) {
        const [quest] = milestone.availableQuests;

        const destinyQuest =
          manifest.DestinyInventoryItemDefinition[quest.questItemHash];

        const icon = destinyMilestone.displayProperties.hasIcon
          ? destinyMilestone.displayProperties.icon
          : destinyQuest.displayProperties.icon;

        quests.push({
          activities: [],
          ...destinyMilestone.displayProperties,
          icon,
          hash: destinyMilestone.hash,
        });
      }
    }

    return { activityTypes, milestonesByKey, quests };
  }, [manifest, publicMilestones]);

  return (
    <div className="w-full container mx-auto pb-32 pt-8">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <h5 className="text-xs uppercase text-yellow-500 font-bold pb-4">
            Activities - {selected}
          </h5>
          <div className="flex items-start w-full gap-4">
            <ul className="flex flex-col gap-1">
              <ActivitySelect
                value={"All"}
                description=""
                image={`https://www.bungie.net/common/destiny2_content/icons/e39ec2ffc0f404c8cd879cdea4b548d6.png`}
                isSelected={selected === "All"}
                onClick={() => setSelected("All")}
              />

              {data &&
                Object.keys(data.activityTypes).map((type) => (
                  <ActivitySelect
                    key={type}
                    value={type}
                    description={data.activityTypes[type].description}
                    image={`https://bungie.net${data.activityTypes[type].icon}`}
                    isSelected={selected === type}
                    onClick={() => setSelected(type)}
                  />
                ))}
            </ul>
            <div className="grid grid-cols-2 w-full gap-2 ">
              {data
                ? selected === "All"
                  ? Object.values(data.milestonesByKey).map((values) =>
                      values.map((item) => (
                        <MilestoneActivityItem
                          milestone={item}
                          key={crypto.randomUUID()}
                        />
                      ))
                    )
                  : data.milestonesByKey[selected].map((item) => (
                      <MilestoneActivityItem
                        milestone={item}
                        key={crypto.randomUUID()}
                      />
                    ))
                : null}
            </div>
          </div>
        </div>
        <div>
          <h5 className="text-xs uppercase text-yellow-500 font-bold pb-4">
            Quests
          </h5>
          <div className="flex w-64 flex-wrap gap-2">
            {data &&
              data.quests.map((milestone) => (
                <MilestoneQuestItem
                  milestone={milestone}
                  key={milestone.name}
                  status={milestones[milestone.hash]?.availableQuests[0].status}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

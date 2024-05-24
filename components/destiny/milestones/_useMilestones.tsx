import useSWR from "swr";
import { getMilestones } from "./actions";
import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";
import {
  DestinyMilestone,
  DestinyPublicMilestone,
  DestinyPublicMilestoneChallengeActivity,
} from "bungie-api-ts/destiny2";
import { Milestone } from "lucide-react";

interface Props {
  milestones: Record<number, DestinyMilestone>;
  publicMilestones: Record<number, DestinyPublicMilestone>;
}

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
  isComplete?: boolean;
};

export function useMilestones({ milestones, publicMilestones }: Props) {
  const manifest = useManifest();

  return React.useMemo(() => {
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

      const isComplete = typeof milestones[parseInt(key)] === "undefined";

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
              isComplete,
            },
          ];
        } else {
          milestonesByKey[name] = [
            {
              activities: milestone.activities,
              ...destinyMilestone.displayProperties,
              hash: destinyMilestone.hash,
              isComplete,
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
  }, [manifest, milestones, publicMilestones]);
}

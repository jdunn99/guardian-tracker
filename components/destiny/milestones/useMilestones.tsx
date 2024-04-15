"use client";

import React from "react";
import useSWR from "swr";
import { useManifest } from "@/lib/manifest/useManifest";
import { getMilestones } from "./actions";
import {
  DestinyActivityDefinition,
  DestinyMilestoneDefinition,
} from "bungie-api-ts/destiny2";

export type ParsedMilestone = {
  hash: number;
  activityHash: number;
  name: string;
  icon: string;
  challenge: string;
};

export function useMilestones() {
  const { data } = useSWR("milestones", async () => await getMilestones());
  const manifest = useManifest();

  return React.useMemo(() => {
    if (!data || !manifest) {
      return null;
    }

    // const results: DestinyMilestoneDefinition[] = [];
    const results: ParsedMilestone[] = [];

    for (const milestone of Object.values(data)) {
      if (!milestone.activities) {
        continue;
      }

      const [activity] = milestone.activities;
      if (activity.challengeObjectiveHashes.length === 0) {
        continue;
      }

      const split =
        manifest.DestinyActivityDefinition[
          activity.activityHash
        ].displayProperties.name.split(":");
      const name = split.splice(0, split.length - 1).join();

      const [challengeHash] = activity.challengeObjectiveHashes;
      const challenge = manifest.DestinyObjectiveDefinition[challengeHash];
      const icon =
        manifest.DestinyActivityDefinition[activity.activityHash]
          .displayProperties.icon;

      results.push({
        hash: milestone.milestoneHash,
        activityHash: activity.activityHash,
        name,
        icon:
          icon === "/img/misc/missing_icon_d2.png"
            ? "/common/destiny2_content/icons/DestinyMilestoneDefinition_fbba06b79fd1752af47e133cce7a3f45.png"
            : icon,
        challenge:
          challenge.displayProperties.name === "Weekly Exotic Rotator Challenge"
            ? "Weekly Exotic Mission"
            : challenge.displayProperties.name,
      });

      // const milestone = manifest.DestinyMilestoneDefinition[milestoneHash];
      // results.push(manifest.DestinyMilestoneDefinition[milestoneHash]);
    }

    return results;
  }, [data, manifest]);
}

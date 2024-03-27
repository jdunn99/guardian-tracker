import { $http, getManifest2 } from "@/lib/bungie";
import {
  DestinyActivityChallengeDefinition,
  DestinyActivityDefinition,
  DestinyActivityRewardDefinition,
  DestinyInventoryItemDefinition,
  DestinyManifestSlice,
  DestinyPublicMilestoneChallengeActivity,
  getPublicMilestones,
} from "bungie-api-ts/destiny2";
import inventoryManifest from "@/app/inventoryManifest.json";
import { Milestone } from "./milestone";
import { Suspense } from "react";

const WEEKLY_MISSION_HASH = 1320261963;

export type WeeklyActivity = {
  name: string;
  activityName: string;
  description: string;
  rewards: DestinyInventoryItemDefinition[];
  image: string;
};

export function parseActivityRewards(
  rewards: DestinyActivityRewardDefinition[]
) {
  const result: DestinyInventoryItemDefinition[] = [];

  for (const reward of rewards) {
    for (const rewardItem of reward.rewardItems) {
      result.push(
        inventoryManifest[rewardItem.itemHash as keyof typeof inventoryManifest]
      );
    }
  }

  return result;
}

function parseRewardsFromActivity(
  hash: number,
  rewards: DestinyActivityRewardDefinition[],
  challenges: DestinyActivityChallengeDefinition[]
) {
  const result: DestinyInventoryItemDefinition[] = [];
  if (hash === WEEKLY_MISSION_HASH) {
    result.push(
      inventoryManifest[
        rewards[0].rewardItems[0].itemHash as keyof typeof inventoryManifest
      ]
    );
  }

  for (const challenge of challenges) {
    for (const dummyReward of challenge.dummyRewards) {
      result.push(
        inventoryManifest[
          dummyReward.itemHash as keyof typeof inventoryManifest
        ]
      );
    }
  }

  return result;
}

function parseActivity(
  activities: DestinyPublicMilestoneChallengeActivity[],
  manifest: DestinyManifestSlice<
    ("DestinyActivityDefinition" | "DestinyObjectiveDefinition")[]
  >
) {
  if (!activities || activities.length === 0) {
    return;
  }

  const [activity] = activities;
  const { activityHash, challengeObjectiveHashes } = activity;

  if (challengeObjectiveHashes.length === 0) {
    return;
  }

  const { pgcrImage, displayProperties, challenges, rewards } =
    manifest.DestinyActivityDefinition[activityHash];

  const [hash] = challengeObjectiveHashes;

  const parsedRewards = parseRewardsFromActivity(hash, rewards, challenges);
  const hashed = manifest.DestinyObjectiveDefinition[hash];

  return {
    name:
      hash === WEEKLY_MISSION_HASH
        ? "Weekly Exotic Mission"
        : hashed.displayProperties.name,
    description: hashed.displayProperties.description,
    image: pgcrImage,
    activityName: displayProperties.name.match(/^[^:]+\s*/)![0],
    rewards: parsedRewards,
  };
}

async function getWeeklyActivityData() {
  const result = await getPublicMilestones($http);
  const { Response: data } = result;
  const manifest = await getManifest2([
    "DestinyActivityDefinition",
    "DestinyObjectiveDefinition",
  ]);

  if (typeof data === "undefined") {
    throw new Error("Something went wrong fetching the milestones");
  }

  const weeklyActivities: WeeklyActivity[] = [];

  for (const key of Object.keys(data)) {
    const parsed = parseActivity(data[parseInt(key)].activities, manifest);
    if (parsed) weeklyActivities.push(parsed);
  }

  return weeklyActivities;
}

export async function WeeklyMilestones() {
  const weeklyActivities = await getWeeklyActivityData();

  return (
    <div className="grid gap-2 sm:grid-cols-3 sm:place-items-center">
      {weeklyActivities.map((activity) => (
        <Suspense fallback={<p>Loading</p>} key={activity.name}>
          <Milestone {...activity} />
        </Suspense>
      ))}
    </div>
  );
}

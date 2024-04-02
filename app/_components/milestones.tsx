import { $http, getManifest2 } from "@/lib/bungie";
import {
  DestinyActivityChallengeDefinition,
  DestinyActivityRewardDefinition,
  DestinyInventoryItemDefinition,
  DestinyManifestSlice,
  DestinyPublicMilestoneChallengeActivity,
  getPublicMilestones,
} from "bungie-api-ts/destiny2";
import inventoryManifest from "@/app/inventoryManifest.json";
import { Milestone } from "./milestone";
import { Suspense } from "react";
import { WeeklyExoticMission } from "./weekly-mission";
import { db } from "@/lib/db";

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
        inventoryManifest[
          rewardItem.itemHash as unknown as keyof typeof inventoryManifest
        ] as DestinyInventoryItemDefinition
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
        rewards[0].rewardItems[0]
          .itemHash as unknown as keyof typeof inventoryManifest
      ] as DestinyInventoryItemDefinition
    );
  }

  for (const challenge of challenges) {
    for (const dummyReward of challenge.dummyRewards) {
      result.push(
        inventoryManifest[
          dummyReward.itemHash as unknown as keyof typeof inventoryManifest
        ] as DestinyInventoryItemDefinition
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

export async function getWeeklyActivities() {
  const result = await getPublicMilestones($http);
  const { Response: milestones } = result;

  const ids: number[] = [];

  if (!milestones) {
    throw new Error("Something went wrong loading the milestones");
  }

  for (const { activities, milestoneHash } of Object.values(milestones)) {
    if (activities && activities.length > 0) {
      const [activity] = activities;

      if (activity.challengeObjectiveHashes.length > 0) {
        ids.push(milestoneHash);
      }
    }
  }

  return await db.destinyActivity.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}

export async function WeeklyMilestones() {
  // const weeklyActivities = await getWeeklyActivityData();
  const milestones = await getWeeklyActivities();

  return (
    <div className="grid gap-8 grid-cols-3 mx-auto max-w-screen-xl ">
      {/* <WeeklyExoticMission /> */}
      {milestones.map((milestone) => (
        <Suspense fallback={<p>Loading</p>} key={milestone.id}>
          <Milestone {...milestone} />
        </Suspense>
      ))}
    </div>
  );
}

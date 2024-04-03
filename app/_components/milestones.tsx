import { $http } from "@/lib/bungie";
import { getPublicMilestones } from "bungie-api-ts/destiny2";
import { Milestone } from "./milestone";
import { Suspense } from "react";
import { db } from "@/lib/db";

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
  const milestones = await getWeeklyActivities();

  return (
    <div className="grid gap-8 grid-cols-3 mx-auto max-w-screen-xl ">
      {milestones.map((milestone) => (
        <Suspense fallback={<p>Loading</p>} key={milestone.id}>
          <Milestone {...milestone} />
        </Suspense>
      ))}
    </div>
  );
}

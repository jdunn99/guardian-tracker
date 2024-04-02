import { $http, getManifest2 } from "@/lib/bungie";
import { getPublicMilestones } from "bungie-api-ts/destiny2";

interface WeeklyExoticMissionProps {
  id: number;
}

export async function WeeklyExoticMission({ id }: WeeklyExoticMissionProps) {
  for (const milestone in milestones) {
    console.log(milestone);
  }

  return <p>Hi</p>;
}

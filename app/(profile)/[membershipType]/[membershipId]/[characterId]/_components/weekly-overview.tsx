import { Milestone } from "@/app/_components/milestone";
import { getWeeklyActivities } from "@/app/_components/milestones";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DestinyMilestone } from "bungie-api-ts/destiny2";

function isMilestoneComplete(milestone: DestinyMilestone) {
  for (const activity of milestone.activities) {
    for (const challenge of activity.challenges) {
      if (challenge.objective.complete) {
        return true;
      }
    }
  }

  return false;
}

export async function WeeklyOverview({
  milestones,
}: {
  milestones: Record<number, DestinyMilestone>;
}) {
  const activities = await getWeeklyActivities();

  return (
    <div className="space-y-2">
      <h3 className=" text-slate-100 font-semibold ">Weekly Overview</h3>
      <ul className="flex gap-2">
        {activities.map((activity) => (
          <li key={activity.id} className="h-full flex-1">
            <Card>
              <h5 className="text-xs uppercase text-yellow-500 font-bold"></h5>
              <Milestone milestone={activity} variant="small">
                <Checkbox
                  disabled
                  checked={isMilestoneComplete(milestones[Number(activity.id)])}
                />
              </Milestone>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

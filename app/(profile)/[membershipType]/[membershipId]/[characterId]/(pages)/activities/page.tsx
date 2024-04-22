import {
  GetDestinyAggregateActivityStatsParams,
  getDestinyAggregateActivityStats,
} from "bungie-api-ts/destiny2";
import { Props } from "../../page";
import { $http } from "@/lib/bungie";
import { AggregateDataBarChart } from "./_components/aggregate-data-bar-chart";
import { ActivityFilters } from "./_components/activity-filters";
import { TestBarChart } from "./_components/bar-chart";
import { AggregateDataTable } from "./_components/aggregate-data-table";

export async function getAggregateActivities(
  params: GetDestinyAggregateActivityStatsParams
) {
  const result = await getDestinyAggregateActivityStats($http, params);

  if (!result.Response) {
    throw new Error(
      "Something went wrong fetching the activities for the User"
    );
  }

  return result.Response;
}

export default async function CharacterActivitiesPage({ params }: Props) {
  const { membershipType, membershipId, characterId } = params;
  const aggregateActivities = await getAggregateActivities({
    characterId,
    membershipType: parseInt(membershipType),
    destinyMembershipId: membershipId,
  });

  return (
    <div className="grid pt-8">
      <div className="grid gap-4 lg:grid-cols-10 h-96 px-8">
        <ActivityFilters aggregateActivities={aggregateActivities} />

        <AggregateDataBarChart aggregateActivities={aggregateActivities} />
        <TestBarChart aggregateActivities={aggregateActivities} />
        <div className="col-span-3">
          {/* <ActivitiesTable
            {...params}
            mode={DestinyActivityModeType.Raid}
            membershipType={parseInt(membershipType)}
            destinyMembershipId={membershipId}
          /> */}
          <div />
        </div>
      </div>
      <AggregateDataTable aggregateActivities={aggregateActivities} />
    </div>
  );
}

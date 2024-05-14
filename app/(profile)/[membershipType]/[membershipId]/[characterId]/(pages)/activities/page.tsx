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
import React from "react";
import { LineChartsContainer } from "./_components/charts/line/line-container";
import { ActivitiesList } from "./_components/table/activities-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <section className="grid gap-8 pt-8">
      <div className="grid md:grid-cols-2 xl:grid-cols-10">
        <ActivityFilters aggregateActivities={aggregateActivities} />
        <AggregateDataBarChart aggregateActivities={aggregateActivities} />
        <TestBarChart aggregateActivities={aggregateActivities} />

        <LineChartsContainer params={params} />
      </div>
      <div className="grid gap-4 grid-cols-8 ">
        <ScrollArea className="col-span-5 h-[calc(100vh-588px)] ">
          <AggregateDataTable aggregateActivities={aggregateActivities} />
          <ScrollBar className="fill-slate-900" />
        </ScrollArea>

        <ScrollArea className="col-span-3 h-[calc(100vh-588px)] overflow-auto">
          <ActivitiesList params={params} />
        </ScrollArea>
      </div>
    </section>
  );
}

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
import { CharacterHeader } from "../../_components/header";
import { getDestinyProfile } from "../../../page";
import { LineChartsContainer } from "./_components/charts/line/line-container";
import { ActivitiesList } from "./_components/table/activities-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ScrollAreaThumb } from "@radix-ui/react-scroll-area";

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

  // const data = await getDestinyProfile(parseInt(membershipType), membershipId);

  // const { characters, profile, profileCommendations, profileRecords } = data;
  // const character = characters.data![params.characterId];

  return (
    <React.Fragment>
      {/* <CharacterHeader
        character={character}
        profile={profile.data!}
        records={profileRecords.data!.records}
        titleRecordHash={character.titleRecordHash}
        profileCommendations={profileCommendations.data!}
      /> */}
      <section className="grid gap-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-10">
          <ActivityFilters aggregateActivities={aggregateActivities} />
          <AggregateDataBarChart aggregateActivities={aggregateActivities} />
          <TestBarChart aggregateActivities={aggregateActivities} />

          <LineChartsContainer params={params} />
        </div>
        <div className="grid gap-4 grid-cols-8 ">
          <ScrollArea className="col-span-5 h-[calc(100vh-432px)] ">
            <AggregateDataTable aggregateActivities={aggregateActivities} />
            <ScrollBar className="fill-slate-900" />
          </ScrollArea>

          <ScrollArea className="col-span-3 h-[calc(100vh-432px)] overflow-auto">
            <ActivitiesList params={params} />
          </ScrollArea>
        </div>
      </section>
    </React.Fragment>
  );
}

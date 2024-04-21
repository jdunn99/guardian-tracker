import React from "react";
import { getDestinyProfile } from "../page";
import { CharacterHeader } from "./_components/header";
import { Ranks } from "./_components/ranks";
import { SeasonProgression } from "./_components/season";
import { TriumphTitles } from "./_components/triumphs/titles";
import { parseItems } from "./actions";
import { Subclass } from "./_components/loadout/subclass";
import { Weapons } from "./_components/loadout/weapons";
import { ActivityHistory } from "./_components/activities/activity-history";
import { getMilestones } from "@/components/destiny/milestones/actions";
import { WeeklyShortMilestones } from "./_components/weekly/shortlist";
import { StatsContainer } from "./_components/metrics/stats-container";

interface Props {
  params: {
    membershipType: string;
    membershipId: string;
    characterId: string;
  };
}

export default async function CharacterPage({ params }: Props) {
  const { membershipType, membershipId, characterId } = params;
  const data = await getDestinyProfile(parseInt(membershipType), membershipId);
  await getMilestones();

  const {
    characters,
    profile,
    characterProgressions,
    characterEquipment,
    characterActivities,
    profileCommendations,
    profileRecords,
    characterPresentationNodes,
  } = data;

  const character = characters.data![characterId];
  const progressions = characterProgressions.data![characterId].progressions;
  const milestones = characterProgressions.data![characterId].milestones;
  const currentSeason = profile.data!.currentSeasonHash;

  if (!currentSeason) {
    throw new Error("Something went wrong fetching the seasonal data");
  }

  const { subclass, weapons, armor } = parseItems(
    characterEquipment.data![characterId].items
  );

  return (
    <React.Fragment>
      <CharacterHeader
        character={character}
        profile={profile.data!}
        records={profileRecords.data!.records}
        titleRecordHash={character.titleRecordHash}
        profileCommendations={profileCommendations.data!}
      />
      <section className="container w-full mx-auto py-12">
        <div className="grid lg:grid-cols-7  gap-2">
          <div className="lg:col-span-2 space-y-2 shrink-0">
            <div className="grid gap-2 max-lg:grid-cols-2 max-sm:grid-cols-1">
              <SeasonProgression
                seasonHash={currentSeason}
                progressions={progressions}
              />
              <Subclass
                light={character.light}
                membershipId={membershipId}
                membershipType={parseInt(membershipType)}
                stats={character.stats}
                subclass={subclass}
              />
            </div>
            <Weapons
              membershipId={membershipId}
              membershipType={parseInt(membershipType)}
              weapons={weapons}
            />
            <Weapons
              membershipId={membershipId}
              membershipType={parseInt(membershipType)}
              weapons={armor}
            />
          </div>
          <div className="space-y-2 lg:col-span-5">
            <div className="grid sm:grid-cols-2 gap-2">
              <Ranks {...characterProgressions.data![characterId]} />
              <TriumphTitles
                characterPresentationNodes={
                  characterPresentationNodes.data![characterId].nodes
                }
              />
            </div>

            <WeeklyShortMilestones
              characterActivities={
                characterActivities.data![characterId].availableActivities
              }
            />
            <StatsContainer
              destinyMembershipId={membershipId}
              membershipType={parseInt(membershipType)}
              characterId={characterId}
            />

            <ActivityHistory
              characterId={characterId}
              destinyMembershipId={membershipId}
              membershipType={parseInt(membershipType)}
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

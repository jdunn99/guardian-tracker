import React from "react";
import { getDestinyProfile } from "../page";
import { CharacterHeader } from "./_components/header";
import { Ranks } from "./_components/ranks";
import { CharacterLoadout } from "./_components/loadout/loadout";
import { Card } from "@/components/ui/card";
import { SeasonProgression } from "./_components/season";
import { TriumphTitles } from "./_components/triumphs/titles";

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

  const {
    characters,
    profile,
    characterProgressions,
    characterEquipment,
    itemComponents,
    profileCommendations,
    profileRecords,
    characterPresentationNodes,
  } = data;

  const character = characters.data![characterId];
  const progressions = characterProgressions.data![characterId].progressions;
  const currentSeason = profile.data!.currentSeasonHash;

  if (!currentSeason) {
    throw new Error("Something went wrong fetching the seasonal data");
  }

  return (
    <React.Fragment>
      <CharacterHeader
        character={character}
        profile={profile.data!}
        records={profileRecords.data!.records}
        titleRecordHash={character.titleRecordHash}
        profileCommendations={profileCommendations.data!}
      />
      <section className="max-w-screen-xl w-full mx-auto pt-12">
        <div className="grid grid-cols-8 gap-2">
          <div className="col-span-3 space-y-2">
            <SeasonProgression
              seasonHash={currentSeason}
              progressions={progressions}
            />
            <Card>
              <h5 className="text-xs uppercase text-yellow-500 font-bold">
                Subclass
              </h5>
              <CharacterLoadout
                items={characterEquipment.data![characterId].items}
                perks={itemComponents.perks.data!}
                membershipId={membershipId}
                membershipType={parseInt(membershipType)}
              />
            </Card>
          </div>
          <div className="space-y-2 col-span-5">
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <div className="flex w-full justify-center h-full items-center">
                  <Ranks {...characterProgressions.data![characterId]} />
                </div>
              </Card>
              <TriumphTitles
                characterPresentationNodes={
                  characterPresentationNodes.data![characterId].nodes
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Card>
                <h5 className="text-xs uppercase text-yellow-500 font-bold">
                  Raid
                </h5>
              </Card>

              <Card>
                <h5 className="text-xs uppercase text-yellow-500 font-bold">
                  Nightfall
                </h5>
              </Card>
              <Card>
                <h5 className="text-xs uppercase text-yellow-500 font-bold">
                  Dungeon
                </h5>
              </Card>
            </div>

            <Card>
              <h5 className="text-xs uppercase text-yellow-500 font-bold">
                Metrics
              </h5>
            </Card>

            <Card>
              <h5 className="text-xs uppercase text-yellow-500 font-bold">
                Recent Activity
              </h5>
            </Card>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

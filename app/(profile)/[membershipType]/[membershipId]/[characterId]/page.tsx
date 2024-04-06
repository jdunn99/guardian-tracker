import React from "react";
import { getDestinyProfile } from "../page";
import { CharacterHeader } from "./_components/header";
import { Ranks } from "./_components/ranks";
import { CharacterLoadout } from "./_components/loadout/loadout";
import { Card } from "@/components/ui/card";
import { WeeklyOverview } from "./_components/weekly-overview";

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
  } = data;

  if (!profile.data) {
    throw new Error("Error fetching the characters");
  }

  if (!characters.data) {
    throw new Error("Error fetching the characters");
  }

  const character = characters.data[characterId];

  return (
    <React.Fragment>
      <section className="container flex items-start pt-24 w-full mx-auto justify-between">
        <CharacterHeader character={character} profile={profile.data} />
        <div className="flex-col items-end justify-end flex gap-1">
          <span className="text-xs uppercase text-yellow-500 font-bold ">
            Ranks
          </span>
          <Ranks {...characterProgressions.data![characterId]} />
        </div>
      </section>
      <section className="pt-8 container mx-auto w-full">
        <ul className="flex items-center gap-8 text-slate-300 font-medium">
          <li>Overview</li>
          <li>Checklist</li>
          <li>Activities</li>
          <li>Builds</li>
        </ul>
      </section>
      <section className="pt-8 container mx-auto w-full">
        <div className="grid grid-cols-4 gap-4">
          <CharacterLoadout
            items={characterEquipment.data![characterId].items}
            perks={itemComponents.perks.data!}
          />
          <div className="col-span-3">
            <WeeklyOverview
              milestones={characterProgressions.data![characterId].milestones}
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

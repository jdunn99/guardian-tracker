import React from "react";
import { Props } from "./overview/page";
import { getDestinyProfile } from "../../page";
import { CharacterHeader } from "../_components/header";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
} & Props) {
  const { membershipType, membershipId, characterId } = params;
  const data = await getDestinyProfile(parseInt(membershipType), membershipId);

  const { characters, profile, profileCommendations, profileRecords } = data;
  const character = characters.data![params.characterId];

  return (
    <React.Fragment>
      <CharacterHeader
        character={character}
        profile={profile.data!}
        records={profileRecords.data!.records}
        titleRecordHash={character.titleRecordHash}
        profileCommendations={profileCommendations.data!}
      />
      {children}
    </React.Fragment>
  );
}

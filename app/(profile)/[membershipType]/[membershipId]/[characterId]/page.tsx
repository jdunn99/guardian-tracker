import React from "react";
import { getDestinyProfile } from "../page";
import {
  DestinyInventoryItemDefinition,
  getDestinyEntityDefinition,
} from "bungie-api-ts/destiny2";
import { $http } from "@/lib/bungie";
import Image from "next/image";
import { CharacterHeader } from "./_components/header";

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

  const { characters, profile } = data;

  if (!profile.data) {
    throw new Error("Error fetching the characters");
  }

  if (!characters.data) {
    throw new Error("Error fetching the characters");
  }

  const character = characters.data[characterId];

  return (
    <React.Fragment>
      <CharacterHeader character={character} profile={profile.data} />
    </React.Fragment>
  );
}

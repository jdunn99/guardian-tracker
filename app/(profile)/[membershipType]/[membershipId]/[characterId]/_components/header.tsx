"use client";
import {
  DestinyCharacterComponent,
  DestinyProfileComponent,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { CLASS_TYPES, RACE_TYPES } from "../../_components/characters";

interface CharacterHeaderProps {
  character: DestinyCharacterComponent;
  profile: DestinyProfileComponent;
}

export function CharacterHeader({ character, profile }: CharacterHeaderProps) {
  return (
    <header className="flex items-start gap-2">
      <Image
        src={`https://bungie.net${character.emblemPath}`}
        width={256}
        height={256}
        alt="emblem"
        className="w-20 h-20 rounded-lg border-slate-700 border"
      />
      <div>
        <h1 className="text-2xl text-white font-bold">
          {profile.userInfo.bungieGlobalDisplayName}
          <span className="text-yellow-500 ml-2 text-xl">
            #{profile.userInfo.bungieGlobalDisplayNameCode}
          </span>
        </h1>
        <h2 className=" text-slate-300 ">
          {RACE_TYPES[character.raceType]} {CLASS_TYPES[character.classType]}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-yellow-400">{character.light}</p>
        </div>
      </div>
    </header>
  );
}

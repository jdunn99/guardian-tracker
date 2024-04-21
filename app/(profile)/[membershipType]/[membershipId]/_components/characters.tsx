"use client";
import {
  DestinyCharacterComponent,
  DestinyClass,
  DestinyRace,
} from "bungie-api-ts/destiny2";
import Link from "next/link";
import { FaDiamond } from "react-icons/fa6";

import { usePathname } from "next/navigation";
import React from "react";

export const CLASS_TYPES: Record<DestinyClass, string> = {
  0: "Titan",
  1: "Hunter",
  2: "Warlock",
  3: "Unknown",
};

export const RACE_TYPES: Record<DestinyRace, string> = {
  0: "Human",
  1: "Awoken",
  2: "Exo",
  3: "Unknown",
};

export function CharacterEmblem(character: DestinyCharacterComponent) {
  const pathname = usePathname();

  return (
    <React.Fragment>
      <Link
        href={pathname + `/${character.characterId}`}
        className="w-[400px] h-20 bg-slate-500 block relative hover:border-2 border-slate-700 transition-all "
        style={{
          backgroundImage: `url("https://bungie.net${character.emblemBackgroundPath}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="absolute right-4 top-2 text-yellow-400 text-2xl font-bold inline-flex items-center">
          <FaDiamond className="text-xs" />
          {character.light}
        </span>
        <div className="pt-2 pl-20 space-y-1">
          <h1 className="text-xl text-white font-semibold">
            {CLASS_TYPES[character.classType]}
          </h1>
          <h2 className="text-lg text-slate-400">
            {RACE_TYPES[character.raceType]}
          </h2>
        </div>
      </Link>
      <span className="text-xs text-slate-300 font-medium">
        Last seen: {new Date(character.dateLastPlayed).toDateString()}
      </span>
    </React.Fragment>
  );
}

export function Characters(
  characters: Record<string, DestinyCharacterComponent>
) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase text-yellow-500 font-bold">
        Characters
      </div>
      <div className="space-y-4">
        {Object.values(characters).map((character) => (
          <CharacterEmblem {...character} key={character.characterId} />
        ))}
      </div>
    </div>
  );
}

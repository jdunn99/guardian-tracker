"use client";
import {
  DestinyCharacterComponent,
  DestinyClass,
  DestinyProfileComponent,
  DestinyRace,
  DestinySocialCommendationsComponent,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { FaDiamond } from "react-icons/fa6";
import { CharacterTitle, CharacterTitleProps } from "./header/title";
import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";
import { FaStar } from "react-icons/fa";

interface CharacterHeaderProps extends CharacterTitleProps {
  character: DestinyCharacterComponent;
  profile: DestinyProfileComponent;
  profileCommendations: DestinySocialCommendationsComponent;
}

const CLASS_TYPES: Record<DestinyClass, string> = {
  0: "Titan",
  1: "Hunter",
  2: "Warlock",
  3: "Unknown",
};

const RACE_TYPES: Record<DestinyRace, string> = {
  0: "Human",
  1: "Awoken",
  2: "Exo",
  3: "Unknown",
};

export function CharacterHeader({
  character,
  profile,
  records,
  titleRecordHash,
  profileCommendations,
}: CharacterHeaderProps) {
  const manifest = useManifest();

  if (!manifest) {
    // TODO: Add skeleton
    return null;
  }

  const emblem = manifest.DestinyInventoryItemDefinition[character.emblemHash];
  const guardianRank =
    manifest.DestinyGuardianRankDefinition[profile.currentGuardianRank];
  const { secondarySpecial, secondaryOverlay } = emblem;

  return (
    <header className="flex items-start gap-2">
      <div
        className="w-full relative h-32 "
        style={{
          backgroundImage: `url("https://www.bungie.net${secondarySpecial}")`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute -bottom-4 w-full  ">
          <div className="w-full mx-auto flex item-start max-w-screen-lg relative">
            <Image
              src={`https://bungie.net${secondaryOverlay}`}
              width={72}
              height={72}
              className="shadow-xl "
              alt="bg"
            />
            <div className="ml-4 absolute left-16 bottom-6">
              <h1 className="text-4xl font-bold text-white">
                {profile.userInfo.bungieGlobalDisplayName}
                <span className="text-yellow-500 ml-2 text-xl">
                  #{profile.userInfo.bungieGlobalDisplayNameCode}
                </span>
              </h1>
              <div className="flex gap-2 items-center">
                <h2 className=" text-slate-300 ">
                  {RACE_TYPES[character.raceType]}{" "}
                  {CLASS_TYPES[character.classType]}
                </h2>
                <span className="text-xs text-white font-light">/ /</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                  <Image
                    src={`https://bungie.net${guardianRank.displayProperties.icon}`}
                    width={16}
                    height={16}
                    alt="rank"
                  />
                  {guardianRank.displayProperties.name}
                </span>

                <span className="text-xs text-white font-light">/ /</span>
                <FaStar className="text-white" />
                <span className="text-xs text-white">
                  {profileCommendations.totalScore}
                </span>
                {typeof titleRecordHash !== "undefined" ? (
                  <React.Fragment>
                    <span className="text-xs text-white font-light">/ /</span>
                    <CharacterTitle
                      records={records}
                      titleRecordHash={titleRecordHash}
                    />
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyPlayer } from "bungie-api-ts/destiny2";
import Image from "next/image";
import Link from "next/link";
import {
  CLASS_TYPES,
  CharacterEmblem,
  RACE_TYPES,
} from "../../../../_components/characters";
import React from "react";
import { FaDiamond } from "react-icons/fa6";

interface PGCRCharacterProps {
  player: DestinyPlayer;
  characterId: string;
}

function PGCRHoverContent({ player }: Pick<PGCRCharacterProps, "player">) {
  const manifest = useManifest();

  if (!manifest) {
    return null;
  }

  const emblem = manifest.DestinyInventoryItemDefinition[player.emblemHash];

  return (
    <React.Fragment>
      <div
        className="w-[400px] h-20 bg-slate-500 block relative hover:border-2 border-slate-700 transition-all "
        style={{
          backgroundImage: `url("https://bungie.net${emblem.secondaryIcon}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="absolute right-4 top-2 text-yellow-400 text-2xl font-bold inline-flex items-center">
          <FaDiamond className="text-xs" />
          {player.lightLevel}
        </span>
        <div className="pt-2 pl-20 space-y-1">
          <h1 className="text-xl text-white font-semibold">
            {player.destinyUserInfo.bungieGlobalDisplayName}
          </h1>

          <h2 className="text-lg text-slate-400">{player.characterClass}</h2>
        </div>
      </div>
      <span className="text-xs text-slate-300 font-medium"></span>
    </React.Fragment>
  );
}

export function PGCRCharacter({ player, characterId }: PGCRCharacterProps) {
  // if(!manifest) {
  //   return null;
  // }

  return (
    <HoverCard>
      <HoverCardTrigger asChild className="col-span-6">
        <Link
          href={`/${player.destinyUserInfo.membershipType}/${player.destinyUserInfo.membershipId}/${characterId}`}
          className="flex items-center gap-2"
        >
          <Image
            src={`https://bungie.net${player.destinyUserInfo.iconPath}`}
            width={24}
            height={24}
            alt="icon"
          />
          <div>
            <h3 className="text-white font-bold">
              {player.destinyUserInfo.bungieGlobalDisplayName}
            </h3>
            <div className="flex gap-2 items-center text-xs">
              <p className="text-slate-400">{player.characterClass}</p>
              <span className="text-yellow-300 inline-flex gap-1 items-center">
                <FaDiamond className="text-[8px]" /> {player.lightLevel}
              </span>
            </div>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="rounded-none border-0 z-50 p-0 bg-slate-800"
        align="start"
      >
        <PGCRHoverContent player={player} />
      </HoverCardContent>
    </HoverCard>
  );
}

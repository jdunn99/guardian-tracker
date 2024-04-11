"use client";

import { Countdown } from "@/components/countdown";
import { Card } from "@/components/ui/card";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyProgression } from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";

interface SeasonProgressionProps {
  seasonHash: number;
  progressions: Record<number, DestinyProgression>;
}
export function SeasonProgression({
  seasonHash,
  progressions,
}: SeasonProgressionProps) {
  const manifest = useManifest();

  if (!manifest) {
    return null;
  }

  const season = manifest.DestinySeasonDefinition[seasonHash];
  if (!season.seasonPassHash) {
    throw new Error("Something went wrong fetching the season pass");
  }

  const seasonPass =
    manifest.DestinySeasonPassDefinition[season.seasonPassHash];

  const { prestigeProgressionHash, rewardProgressionHash } = seasonPass;

  if (!rewardProgressionHash) {
    throw new Error("Something went wrong fetching the seasonal hash!");
  }

  const progression = progressions[rewardProgressionHash];
  const prestige = progressions[prestigeProgressionHash];

  const isPrestige =
    progression.level === progression.levelCap &&
    progression.progressToNextLevel === 0;

  const value = isPrestige ? prestige : progression;

  const percentage = (value.progressToNextLevel / value.nextLevelAt) * 100;

  return (
    <Card>
      <Image
        src={`https://bungie.net${season.displayProperties.icon}`}
        width={48}
        height={48}
        alt="bg"
      />
      <h5 className="text-xs font-bold text-yellow-500 uppercase">
        {season.displayProperties.name}
      </h5>
      <div className="relative bg-slate-700 w-full h-6 mt-2 border border-slate-600/20">
        <div
          style={{ width: `${percentage}%` }}
          className="absolute bg-cyan-600 h-full"
        />
        <div className="absolute w-full z-10 top-0.5">
          <div className="flex px-2 justify-between w-full text-sm text-white font-bold">
            <h2>Rank {isPrestige ? value.level + 100 : value.level}</h2>
            <h2>
              {value.progressToNextLevel.toLocaleString()} /{" "}
              {value.nextLevelAt.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
      {season.endDate ? (
        <span className="text-xs inline-flex  gap-1 text-slate-300 pt-4">
          Ends in <Countdown end={season.endDate} />
        </span>
      ) : null}
    </Card>
  );
  // return <p className="text-white">{JSON.stringify(progression)}</p>;
}

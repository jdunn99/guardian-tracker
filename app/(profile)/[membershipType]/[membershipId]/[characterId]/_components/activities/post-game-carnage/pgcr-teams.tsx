"use client";

import { cn } from "@/lib/utils";
import {
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry,
  DestinyPostGameCarnageReportTeamEntry,
} from "bungie-api-ts/destiny2";
import React from "react";
import { PGCRCharacter } from "./pgcr-character";
import Image from "next/image";
import { PGCREntryWeapons } from "./pgcr-entry-weapons";
import { PGCREntry } from "./pgcr-entry";

const TEAM_MAP = {
  18: {
    name: "Alpha",
    color: "bg-sky-600",
  },
  19: {
    name: "Bravo",
    color: "bg-red-700",
  },
};

/**
 * Represents the PGCR of an activity that involves 2 teams (PvP, Gambit, etc.)
 */

interface PGCRTeamsProps {
  teams: DestinyPostGameCarnageReportTeamEntry[];
  entries: DestinyPostGameCarnageReportEntry[];
}

export function PGCRTeams({ teams, entries }: PGCRTeamsProps) {
  const entriesToTeam = React.useMemo(() => {
    const result: Record<number, DestinyPostGameCarnageReportEntry[]> = {};

    for (const entry of entries) {
      const team = entry.values.team.basic.value;

      if (result[team]) {
        result[team].push(entry);
      } else {
        result[team] = [entry];
      }
    }

    return result;
  }, [entries]);

  return (
    <div className="w-full">
      {teams.map((team) => (
        <div className="w-full" key={team.teamId}>
          <div
            className={cn(
              "w-full px-8 py-2 grid grid-cols-12 gap-4 items-center",
              TEAM_MAP[team.teamId as keyof typeof TEAM_MAP].color
            )}
          >
            <h3 className="font-bold text-white col-span-6">
              {TEAM_MAP[team.teamId as keyof typeof TEAM_MAP].name} -{" "}
              {team.standing.basic.displayValue} (
              {team.score.basic.displayValue})
            </h3>

            <p className="font-semibold text-slate-300 text-xs">Score</p>
            <p className="font-semibold text-slate-300 text-xs">KD/A</p>
            <span className="inline-flex gap-1 items-center text-slate-300 text-xs font-semibold">
              <Image
                src="/precision.svg"
                alt="precision kills"
                width={18}
                height={18}
              />
              Kills
            </span>
            <span className="inline-flex gap-1 items-center text-slate-300 text-xs font-semibold">
              <Image
                src="/grenade.svg"
                alt="precision kills"
                width={18}
                height={18}
              />
              Kills
            </span>
            <p className="font-semibold text-slate-300 text-xs col-span-2">
              Weapons
            </p>
          </div>
          <div className="">
            {entriesToTeam[team.teamId].map((entry) => (
              <PGCREntry entry={entry} key={entry.characterId} />
            ))}
          </div>
        </div>
      ))}
      <div className="w-full bg-orange-500 flex items-center"></div>
    </div>
  );
}

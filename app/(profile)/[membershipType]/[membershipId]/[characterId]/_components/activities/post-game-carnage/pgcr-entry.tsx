"use client";

import { cn } from "@/lib/utils";
import { DestinyPostGameCarnageReportEntry } from "bungie-api-ts/destiny2";
import { PGCRCharacter } from "./pgcr-character";
import { PGCREntryWeapons } from "./pgcr-entry-weapons";

interface PGCREntryProps {
  entry: DestinyPostGameCarnageReportEntry;
}

export function PGCREntry({ entry }: PGCREntryProps) {
  return (
    <div
      className="w-full items-center bg-slate-800/20 px-8 py-3 border-b border-slate-700 grid grid-cols-12 gap-4"
      key={entry.characterId}
    >
      <PGCRCharacter player={entry.player} characterId={entry.characterId} />
      <p className="text-sm text-slate-300">
        {entry.score.basic.value.toLocaleString()}
      </p>
      <div className="text-xs text-slate-300">
        <p>
          {entry.values.kills.basic.displayValue}/
          {entry.values.deaths.basic.displayValue}/
          {entry.values.assists.basic.displayValue}
        </p>
        <p
          className={cn(
            entry.values.killsDeathsAssists.basic.value > 1
              ? "text-green-500"
              : entry.values.killsDeathsAssists.basic.value === 1
                ? "text-slate-300"
                : "text-red-500"
          )}
        >
          {entry.values.killsDeathsAssists.basic.displayValue}
        </p>
      </div>
      <p className="text-xs text-slate-300 ">
        {entry.extended.values.precisionKills.basic.displayValue}
      </p>

      <p className="text-xs text-slate-300">
        {entry.extended.values.weaponKillsGrenade.basic.displayValue}
      </p>
      <PGCREntryWeapons weapons={entry.extended.weapons} />
    </div>
  );
}

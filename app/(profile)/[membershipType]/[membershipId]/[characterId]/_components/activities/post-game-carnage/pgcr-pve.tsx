"use client";

import { DestinyPostGameCarnageReportEntry } from "bungie-api-ts/destiny2";
import Image from "next/image";
import { PGCREntry } from "./pgcr-entry";

interface PGCRPvEProps {
  entries: DestinyPostGameCarnageReportEntry[];
}

export function PGCRPvE({ entries }: PGCRPvEProps) {
  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-full px-8 py-2 grid grid-cols-12 gap-4 items-center bg-slate-700/20">
          <h3 className="font-bold text-white col-span-6"></h3>

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
          {entries.map((entry) => (
            <PGCREntry entry={entry} key={entry.characterId} />
          ))}
        </div>
      </div>
    </div>
  );
}

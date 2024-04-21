"use client";
import { useManifest } from "@/lib/manifest/useManifest";
import { cn } from "@/lib/utils";
import { DestinyRecordComponent } from "bungie-api-ts/destiny2";

import Image from "next/image";

export interface CharacterTitleProps {
  titleRecordHash?: number;
  records: Record<number, DestinyRecordComponent>;
}

function getGildedData(
  gildingTrackingRecordHash: number | undefined,
  records: Record<number, DestinyRecordComponent>
) {
  if (!gildingTrackingRecordHash) {
    return null;
  }

  const gildedRecord = records[gildingTrackingRecordHash];
  if (!gildedRecord) {
    throw new Error("Error finding the gilded record");
  }

  const [objective] = gildedRecord.objectives;
  return {
    completedCount: gildedRecord.completedCount,
    complete: objective.complete,
  };
}

export function CharacterTitle({
  titleRecordHash,
  records,
}: CharacterTitleProps) {
  const manifest = useManifest();

  if (typeof titleRecordHash === "undefined") {
    return null;
  }

  if (!manifest) {
    return null;
  }

  const title = manifest.DestinyRecordDefinition[titleRecordHash];

  if (!title) {
    throw new Error("Title not found in manifest");
  }

  const gildedInfo = getGildedData(
    title.titleInfo.gildingTrackingRecordHash,
    records
  );

  return (
    <div className="flex items-center gap-1 text-xs">
      {title.displayProperties.icon ? (
        <Image
          src={`https://bungie.net${title.displayProperties.icon}`}
          width={16}
          height={16}
          alt="title"
        />
      ) : null}

      <span
        className={cn(
          gildedInfo !== null && gildedInfo.complete
            ? "text-yellow-500"
            : "text-purple-500",
          "inline-flex items-center gap-1 font-bold"
        )}
      >
        {title.displayProperties.name}
        {gildedInfo !== null ? (
          <span className="text-[8px] font-light text-slate-300">
            {gildedInfo.completedCount}
          </span>
        ) : null}
      </span>
    </div>
  );
}

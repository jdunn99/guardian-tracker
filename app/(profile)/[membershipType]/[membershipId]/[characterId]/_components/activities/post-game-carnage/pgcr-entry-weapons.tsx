"use client";

import { DestinyItem } from "@/components/destiny/destiny-item";
import { HoverCard } from "@/components/ui/hover-card";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyHistoricalWeaponStats } from "bungie-api-ts/destiny2";
import Image from "next/image";

interface PGCRWeaponsProps {
  weapons: DestinyHistoricalWeaponStats[];
}

interface PGCRWeaponProps {
  weapon: DestinyHistoricalWeaponStats;
}

function PGCREntryWeapon({ weapon }: PGCRWeaponProps) {
  const manifest = useManifest();
  if (!manifest) {
    return <div className="w-8 h-8 bg-slate-900" />;
  }

  const item = manifest.DestinyInventoryItemDefinition[weapon.referenceId];

  return (
    <DestinyItem item={item} size={24}>
      <div className="space-y-2 px-2 py-4 flex flex-col items-start">
        <div className="flex items-center gap-1">
          <Image src="/skull.svg" width={20} height={20} alt="" />
          Weapon Kills:
          <span className="text-yellow-500 font-bold">
            {weapon.values.uniqueWeaponKills.basic.value}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Image src="/precision.svg" width={20} height={20} alt="" />
          Precision Kills:
          <span className="text-yellow-500 font-bold">
            {weapon.values.uniqueWeaponPrecisionKills.basic.value}
          </span>
        </div>
        <div className="flex items-center gap-1">
          Precision Kill Percentage:
          <span className="text-yellow-500 font-bold">
            {weapon.values.uniqueWeaponKillsPrecisionKills.basic.displayValue}
          </span>
        </div>
      </div>
    </DestinyItem>
  );
}

export function PGCREntryWeapons({ weapons }: PGCRWeaponsProps) {
  return (
    <div className="col-span-2 flex gap-2 flex-wrap">
      {!!weapons
        ? weapons.map((weapon) => (
            <PGCREntryWeapon weapon={weapon} key={weapon.referenceId} />
          ))
        : null}
    </div>
  );
}

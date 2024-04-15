"use client";

import { Card } from "@/components/ui/card";
import { parseItems } from "../../actions";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyItem } from "@/components/destiny/destiny-item";
import { DestinyItemSkeleton } from "@/components/destiny/loading/destiny-item-skeleton";
import Image from "next/image";
import { DestinyInstancedItem } from "@/components/destiny/instanced-item";
interface WeaponsProps {
  weapons: ReturnType<typeof parseItems>["weapons"];
  membershipType: number;
  membershipId: string;
}

interface WeaponProps {
  weapon: WeaponsProps["weapons"][0];
  membershipType: number;
  membershipId: string;
}

function Weapon({ weapon, membershipId, membershipType }: WeaponProps) {
  const manifest = useManifest();

  if (!manifest) return <DestinyItemSkeleton />;

  const item = manifest.DestinyInventoryItemDefinition[weapon.itemHash];
  const damageType =
    item.damageTypeHashes && item.damageTypeHashes[0]
      ? manifest.DestinyDamageTypeDefinition[item.damageTypeHashes[0]]
      : null;

  return (
    <div className="flex items-center gap-2">
      <DestinyInstancedItem
        item={item}
        state={weapon.state}
        itemInstanceId={weapon.itemInstanceId!}
        membershipId={membershipId}
        damageType={damageType}
        membershipType={membershipType}
      />
      <div className="flex justify-between w-full items-center">
        <div>
          {weapon.itemInstanceId}
          <h3 className="font-semibold text-white">
            {item.displayProperties.name}
          </h3>
          <p className="text-xs text-slate-400">
            {item.itemTypeAndTierDisplayName}
          </p>
        </div>
        {damageType !== null ? (
          <Image
            src={`https://bungie.net${damageType.displayProperties.icon}`}
            width={18}
            height={18}
            alt="icon"
          />
        ) : null}
      </div>
    </div>
  );
}

export function Weapons({
  weapons,
  membershipType,
  membershipId,
}: WeaponsProps) {
  return (
    <Card>
      <h5 className="text-xs uppercase text-yellow-500 font-bold">Weapons</h5>
      <div className="space-y-4 mt-4">
        {weapons.map((weapon) => (
          <Weapon
            weapon={weapon}
            key={weapon.itemHash}
            membershipId={membershipId}
            membershipType={membershipType}
          />
        ))}
      </div>
    </Card>
  );
}

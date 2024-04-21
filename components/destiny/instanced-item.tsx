"use client";

import useSWR from "swr";
import { DestinyItem, DestinyItemProps } from "./destiny-item";
import { getItemFromInstanceId } from "@/app/(profile)/[membershipType]/[membershipId]/[characterId]/actions";
import { DestinyItemSkeleton } from "./loading/destiny-item-skeleton";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyDamageTypeDefinition } from "bungie-api-ts/destiny2";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { ArmorStats, WeaponStats } from "./item/stats";

const ICONS = {
  0: {
    image: "",
    value: "",
  },
  1: {
    image: "https://www.bungie.net/img/destiny_content/ammo_types/primary.png",
    value: "PRIMARY",
  },
  2: {
    image: "https://www.bungie.net/img/destiny_content/ammo_types/special.png",
    value: "SPECIAL",
  },
  3: {
    image: "https://www.bungie.net/img/destiny_content/ammo_types/heavy.png",
    value: "HEAVY",
  },
};

interface DestinyInstancedItemProps extends DestinyItemProps {
  itemInstanceId: string;
  membershipId: string;
  membershipType: number;
  damageType: DestinyDamageTypeDefinition | null;
}

export function DestinyInstancedItem({
  item,
  state,
  damageType,
  itemInstanceId,
  membershipId,
  membershipType,
}: DestinyInstancedItemProps) {
  const { data } = useSWR(itemInstanceId, () =>
    getItemFromInstanceId(membershipId, membershipType, itemInstanceId)
  );
  const manifest = useManifest();

  if (!data || !manifest) {
    return <DestinyItemSkeleton />;
  }

  const { instance, perks, stats } = data;
  const icon = damageType?.displayProperties.icon;
  const color = damageType?.color
    ? `rgb(${damageType.color.red},${damageType.color.green},${damageType.color.blue})`
    : "white";
  const ammoType = item.equippingBlock?.ammoType;
  const energy = instance.data!.energy;

  return (
    <DestinyItem item={item} state={state}>
      <div className="py-2">
        <div className="flex gap-2 w-full items-center border-b border-slate-600 p-2">
          {icon && damageType?.displayProperties.name !== "Kinetic" ? (
            <Image
              alt="icon"
              src={`https://bungie.net${icon}`}
              width={24}
              height={24}
            />
          ) : null}
          <h1
            className={cn(color, "text-4xl font-extrabold pr-2")}
            style={{ color }}
          >
            {instance.data!.primaryStat.value}
          </h1>
          <div className="border-l border-slate-600 pl-4 uppercase text-slate-300">
            <div className="inline-flex gap-2 items-center">
              {ammoType ? (
                <React.Fragment>
                  <Image
                    src={ICONS[ammoType as keyof typeof ICONS].image}
                    width={44}
                    height={44}
                    alt="icon"
                  />
                  <h1 className="uppercase ">
                    {ICONS[ammoType as keyof typeof ICONS].value}
                  </h1>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h1 className="text-2xl font-bold">
                    {energy.energyCapacity}
                  </h1>
                  <span className="uppercase">ENERGY</span>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <div className="py-2 pl-2 pr-8 border-b border-slate-600 ">
          {ammoType ? (
            <WeaponStats {...stats.data!.stats} />
          ) : (
            <ArmorStats {...stats.data!.stats} />
          )}
        </div>
        <div className="space-y-2">
          {perks.data &&
            perks.data!.perks.map((perk, index) => {
              const destinyPerk =
                manifest.DestinySandboxPerkDefinition[perk.perkHash];
              return perk.isActive && perk.visible ? (
                <div
                  key={perk.perkHash}
                  className={cn(
                    "flex items-center p-2 gap-2",
                    ammoType && index === 1
                      ? "bg-slate-700/60"
                      : "bg-transparent"
                  )}
                >
                  <Image
                    src={`https://bungie.net${destinyPerk.displayProperties.icon}`}
                    width={28}
                    height={28}
                    alt=""
                  />
                  <div>
                    <h3 className="text-slate-200">
                      {destinyPerk.displayProperties.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {destinyPerk.displayProperties.description}
                    </p>
                  </div>
                </div>
              ) : null;
            })}
        </div>
        {item.collectibleHash ? (
          <div className="p-2 bg-slate-700/60">
            <p className="text-xs text-slate-400">
              {
                manifest.DestinyCollectibleDefinition[item.collectibleHash]
                  .sourceString
              }
            </p>
          </div>
        ) : null}
      </div>
    </DestinyItem>
  );
}

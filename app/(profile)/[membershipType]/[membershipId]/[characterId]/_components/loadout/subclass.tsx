"use client";
import { $http } from "@/lib/bungie";
import { useManifest } from "@/lib/manifest/useManifest";
import {
  DestinyInventoryItemDefinition,
  DestinyItemSocketState,
  getItem,
} from "bungie-api-ts/destiny2";
import { headers } from "next/headers";
import Image from "next/image";
import React from "react";

interface CharacterSubclassProps {
  subclassHash: number;
  sockets: DestinyItemSocketState[];
}

export function Subclass({ subclassHash, sockets }: CharacterSubclassProps) {
  const manifest = useManifest();

  const parsedSockets = React.useMemo(() => {
    if (!manifest) {
      return null;
    }

    let superAbility = {} as DestinyInventoryItemDefinition;
    const abilities: DestinyInventoryItemDefinition[] = [];
    const aspects: DestinyInventoryItemDefinition[] = [];
    const fragments: DestinyInventoryItemDefinition[] = [];

    for (const { plugHash, isEnabled } of sockets) {
      if (!plugHash || !isEnabled) {
        continue;
      }

      const item = manifest.DestinyInventoryItemDefinition[plugHash];
      const type = item.itemTypeDisplayName;

      if (type === "Super Ability") {
        superAbility = item;
      } else if (type.includes("Aspect")) {
        aspects.push(item);
      } else if (type.includes("Fragment")) {
        fragments.push(item);
      } else {
        abilities.push(item);
      }
    }

    return { superAbility, aspects, fragments, abilities };
  }, [manifest, sockets]);

  // TODO: Skeleton
  if (!parsedSockets || !manifest) {
    return null;
  }

  const subclass = manifest.DestinyInventoryItemDefinition[subclassHash];
  const colors = subclass.backgroundColor;

  const { superAbility, aspects, fragments, abilities } = parsedSockets;
  console.log(abilities);

  return (
    <div className="space-y-6 ">
      {/* <div className="flex items-center gap-2 font-bold">
        <Image
          src={`https://bungie.net${subclass.displayProperties.icon}`}
          width={48}
          height={48}
          alt="subclass"
        />
        <div className="uppercase">
          <h1 className="text-xl text-white font-bold">
            {subclass.displayProperties.name}
          </h1>
          <h1 className="text-xs font-light text-slate-300">
            {subclass.itemTypeDisplayName}
          </h1>
        </div>
      </div> */}
      <Image
        src={`https://bungie.net${superAbility.displayProperties.icon}`}
        width={72}
        height={72}
        alt="subclass"
      />
      <div className="flex items-start gap-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-8 justify-between text-xs font-semibold uppercase text-slate-400">
            <div className="space-y-1">
              <h1 className="border-b border-slate-400">Abilities</h1>
              <div className="flex items-center gap-1">
                {abilities.map((ability) => (
                  <Image
                    src={`https://bungie.net${ability.displayProperties.icon}`}
                    width={48}
                    height={48}
                    className="border-slate-700/50 border"
                    alt="icon"
                    key={ability.hash}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="border-b border-slate-400">Aspects</h1>
              <div className="flex items-center gap-1">
                {aspects.map((ability) => (
                  <Image
                    src={`https://bungie.net${ability.displayProperties.icon}`}
                    width={48}
                    height={48}
                    className="border-slate-700/50 border"
                    alt="icon"
                    key={ability.hash}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="border-b border-slate-400 text-slate-400 uppercase text-xs font-bold">
              Fragments
            </h1>
            <div className="flex items-center gap-1 w-full bg-slate-900/50">
              {fragments.map((ability) => (
                <Image
                  src={`https://bungie.net${ability.displayProperties.icon}`}
                  width={48}
                  height={48}
                  className="border-slate-700/50 border"
                  alt="icon"
                  key={ability.hash}
                />
              ))}
            </div>
          </div>
        </div>

        {/* <div className="grid w-full gap-4 text-xs font-semibold uppercase text-slate-400">
          <div className="w-full flex items-center gap-4">
            <div className="full">
              <h1 className="border-b border-slate-700">Abilities</h1>
              <div className={`flex gap-2`}>
                {abilities.map((ability) => (
                  <Image
                    src={`https://bungie.net${ability.displayProperties.icon}`}
                    width={32}
                    height={32}
                    alt="icon"
                    key={ability.hash}
                  />
                ))}
              </div>
            </div>
            <div className="w-full">
              <h1 className="w-full  border-b border-slate-700">Aspects</h1>
            </div>
          </div>

          <div className="w-full col-span-2">
            <h1 className="w-full border-b border-slate-700">Fragments</h1>
          </div>
        </div> */}
      </div>
    </div>
  );
}

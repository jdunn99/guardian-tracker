"use client";
import { Card } from "@/components/ui/card";
import { useManifest } from "@/lib/manifest/useManifest";
import {
  DestinyInventoryItemDefinition,
  DestinyItemSocketState,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import { getItemFromInstanceId, parseItems } from "../../actions";
import { DestinyItem } from "@/components/destiny/destiny-item";
import { SubclassContainer } from "./subclass/subclass-container";

interface SubclassProps {
  subclass: ReturnType<typeof parseItems>["subclass"];
  membershipType: number;
  membershipId: string;
  light: number;
  stats: Record<number, number>;
}

export function Subclass({
  subclass,
  membershipType,
  membershipId,
  light,
  stats,
}: SubclassProps) {
  const manifest = useManifest();
  const { data } = useSWR(subclass?.itemInstanceId, () =>
    getItemFromInstanceId(membershipId, membershipType, subclass.itemInstanceId)
  );

  const parsedSockets = React.useMemo(() => {
    if (!manifest || !data) {
      return null;
    }

    const sockets = data.sockets.data!.sockets;

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
      } else if (type.includes("Fragment") || type === "") {
        fragments.push(item);
      } else {
        abilities.push(item);
      }
    }

    return { superAbility, aspects, fragments, abilities };
  }, [data, manifest]);

  // TODO: Skeleton
  if (!parsedSockets || !manifest) {
    return null;
  }

  const destinySubclass =
    manifest.DestinyInventoryItemDefinition[subclass.itemHash];
  const colors = destinySubclass.backgroundColor;
  const color = `rgba(${colors.red},${colors.green},${colors.blue}, 0.6)`;

  const { superAbility, aspects, fragments, abilities } = parsedSockets;

  return (
    <Card>
      <h5 className="text-xs uppercase text-yellow-500 font-bold">Subclass</h5>
      <div className="space-y-6 ">
        <div className="flex items-center gap-4">
          <Image
            src={`https://bungie.net${superAbility.displayProperties.icon}`}
            width={72}
            height={72}
            alt="subclass"
          />
          <div>
            <h5 className="text-[8px] uppercase text-yellow-500 font-bold">
              Power
            </h5>
            <h1 className="text-yellow-300 font-bold text-3xl">{light}</h1>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {Object.keys(stats).map((stat) =>
                stat !== "1935470627" ? ( // Skip the power stat
                  <span
                    className="inline-flex gap-1 items-center text-xs text-white"
                    key={stat}
                  >
                    <Image
                      src={`https://bungie.net${
                        manifest.DestinyStatDefinition[parseInt(stat)]
                          .displayProperties.icon
                      }`}
                      width={12}
                      height={12}
                      alt="stat"
                    />
                    {stats[parseInt(stat)]}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-8 justify-between text-slate-400 flex-wrap">
              <SubclassContainer
                heading="abilities"
                abilities={abilities}
                color={color}
              />
              <SubclassContainer
                heading="aspects"
                abilities={aspects}
                color={color}
              />
            </div>

            <SubclassContainer
              heading="Fragments"
              abilities={fragments}
              color={color}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

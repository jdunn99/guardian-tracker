"use client";
import { DestinyItem } from "@/components/destiny/destiny-item";
import { DestinyItemSkeleton } from "@/components/destiny/loading/destiny-item-skeleton";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import React from "react";

interface SubclassAbilityProps {
  ability: DestinyInventoryItemDefinition;
  color: string;
}

export function SubclassAbility({ ability, color }: SubclassAbilityProps) {
  const manifest = useManifest();

  const render = React.useMemo(() => {
    if (!manifest) {
      return null;
    }

    const description: string[] = [];
    if (ability.displayProperties.description !== "") {
      description.push(ability.displayProperties.description);
    }

    const perks = ability.perks;
    for (const perk of perks) {
      const destinyPerk = manifest.DestinySandboxPerkDefinition[perk.perkHash];
      if (
        destinyPerk.displayProperties.description !== "" &&
        destinyPerk.displayProperties.description !==
          ability.displayProperties.description
      ) {
        description.push(destinyPerk.displayProperties.description);
      }
    }

    return description;
  }, [ability.displayProperties.description, ability.perks, manifest]);

  if (!render) {
    return <DestinyItemSkeleton />;
  }

  return (
    <DestinyItem item={ability} includeIcon color={color}>
      <div className="text-slate-400 italic text-xs space-y-4">
        {render.map((desc) =>
          desc.split(".").map((desc) => <p key={desc}>{desc}</p>)
        )}
      </div>
    </DestinyItem>
  );
}

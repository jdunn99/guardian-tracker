"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyItemComponent } from "bungie-api-ts/destiny2";
import { DestinyItemSkeleton } from "./loading/destiny-item-skeleton";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
  TooltipBody,
} from "../ui/tooltip";
import Image from "next/image";

export interface DestinyItemProps {
  item: DestinyItemComponent;
}

export function DestinyItem({ item }: DestinyItemProps) {
  const manifest = useManifest();

  if (!manifest) {
    return <DestinyItemSkeleton />;
  }

  if (!manifest.DestinyInventoryItemDefinition) {
    throw new Error("Something went wrong with the manifest");
  }

  const itemDefintion = manifest.DestinyInventoryItemDefinition[item.itemHash];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Image
          src={`https://bungie.net${itemDefintion.displayProperties.icon}`}
          width={48}
          height={48}
          alt={itemDefintion.displayProperties.name}
        />
      </HoverCardTrigger>
      <DestinyTooltip>
        <TooltipHeader>
          <TooltipTitle>{itemDefintion.displayProperties.name}</TooltipTitle>
        </TooltipHeader>
        <TooltipBody>{JSON.stringify(item)}</TooltipBody>
      </DestinyTooltip>
    </HoverCard>
  );
}

"use client";

import {
  DestinyCollectibleDefinition,
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  ItemState,
} from "bungie-api-ts/destiny2";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
  TooltipBody,
  TooltipDescription,
} from "../ui/tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface DestinyItemProps {
  item: DestinyItemComponent;
  state?: ItemState;
}

export function CollectionItem({
  item,
}: {
  item: DestinyCollectibleDefinition;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Image
          src={`https://bungie.net${item.displayProperties.icon}`}
          width={48}
          height={48}
          alt={item.displayProperties.name}
        />
      </HoverCardTrigger>
      <DestinyTooltip>
        <TooltipHeader>
          <TooltipTitle>{item.displayProperties.name}</TooltipTitle>
          <TooltipDescription>
            {item.displayProperties.description}
          </TooltipDescription>
        </TooltipHeader>
        {/* <TooltipBody>{JSON.stringify(item)}</TooltipBody> */}
      </DestinyTooltip>
    </HoverCard>
  );
}

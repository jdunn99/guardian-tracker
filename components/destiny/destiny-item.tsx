"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import {
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  ItemState,
} from "bungie-api-ts/destiny2";
import { DestinyItemSkeleton } from "./loading/destiny-item-skeleton";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
  TooltipBody,
  TooltipDescription,
  TooltipImage,
} from "../ui/tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Items have a BitMaskwhere each bit represents a different possible state that the
 * item can be in that may effect how the item is displayed to the user and what actions can be performed against it.
 * Masterworks correspond the the 4 value in the bitmask
 */
function isMasterworked(state: ItemState) {
  let temp = state;
  let bitPosition = 0;
  while (temp > 0) {
    if (temp & 1) {
      if (1 << bitPosition === 4) {
        return true;
      }
    }
    temp >>= 1;
    bitPosition++;
  }

  return false;
}

// TODO: Convert to RGB and then add the opacity.
const COLORS = {
  Common: "#c2bbb2",
  Uncommon: "#336b3e",
  Rare: "#567e9d",
  Legendary: "#4f3663",
  Exotic: "#cdad36",
};

export interface DestinyItemProps {
  item: DestinyInventoryItemDefinition;
  state?: ItemState;
  includeIcon?: boolean;
  children?: React.ReactNode;
  color?: string;
}

export function DestinyItem({
  item,
  state,
  includeIcon = false,
  children,
  color,
}: DestinyItemProps) {
  const [tier, ...rest] = item.itemTypeAndTierDisplayName.split(" ");

  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Image
          src={`https://bungie.net${item.displayProperties.icon}`}
          width={48}
          className={cn(
            state && isMasterworked(state) && "border border-yellow-500"
          )}
          height={48}
          alt={item.displayProperties.name}
        />
      </HoverCardTrigger>
      <DestinyTooltip>
        <TooltipHeader
          className={cn(
            state && isMasterworked(state) ? "border-t-2 border-yellow-500" : ""
          )}
          style={{
            backgroundColor: color ?? COLORS[tier as keyof typeof COLORS],
          }}
        >
          <TooltipTitle>{item.displayProperties.name}</TooltipTitle>
          <TooltipDescription>
            <div
              className="flex 
            items-center gap-1"
            >
              {...rest.map((temp) => <span key={temp}>{temp}</span>)}
            </div>
            {tier}
          </TooltipDescription>
        </TooltipHeader>
        {includeIcon ? (
          <TooltipImage src={item.screenshot ?? item.secondaryIcon} />
        ) : null}
        <TooltipBody className="p-0">{children}</TooltipBody>
      </DestinyTooltip>
    </HoverCard>
  );
}

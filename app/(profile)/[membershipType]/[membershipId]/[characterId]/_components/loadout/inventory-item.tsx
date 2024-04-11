"use client";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  DestinyTooltip,
  TooltipBody,
  TooltipHeader,
  TooltipTitle,
} from "@/components/ui/tooltip";
import {
  DestinyInventoryItemDefinition,
  ItemState,
} from "bungie-api-ts/destiny2";
import Image from "next/image";

interface InventoryItemProps {
  item: DestinyInventoryItemDefinition;
  state: ItemState;
}

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

export function InventoryItem({ item, state }: InventoryItemProps) {
  const masterworked = isMasterworked(state);

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <HoverCard openDelay={500}>
          <HoverCardTrigger asChild>
            <Image
              src={`https://bungie.net${item.displayProperties.icon}`}
              width={48}
              height={48}
              alt="item"
              className={
                masterworked
                  ? "border border-yellow-500 shadow-yellow-500  shadow-inner"
                  : undefined
              }
            />
          </HoverCardTrigger>
          <DestinyTooltip>
            <TooltipHeader>
              <TooltipTitle>{item.displayProperties.name}</TooltipTitle>
            </TooltipHeader>
            <TooltipBody>
              <p>This is a test</p>
            </TooltipBody>
          </DestinyTooltip>
        </HoverCard>
        <div>
          <h4 className="text-sm text-white font-bold">
            {item.displayProperties.name}
          </h4>
          <p className="text-xs text-slate-300">{item.itemTypeDisplayName}</p>
        </div>
      </div>
    </div>
  );
}

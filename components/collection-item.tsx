"use client";
import { InventoryItem } from "@prisma/client";
import {
  DestinyCollectibleDefinition,
  DestinyInventoryItemDefinition,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";

export function CollectionItem(item: InventoryItem) {
  return (
    <div className="flex items-start gap-2">
      <Image
        src={`https://bungie.net${item.image}`}
        width={32}
        height={32}
        alt={item.name}
      />
      <div className="grid">
        <h3 className="text-white text-xs">{item.name}</h3>
        <span className="text-slate-400 text-[12px]">{item.typeAndTier}</span>
      </div>
    </div>
  );
}

export function SmallInventoryItem(item: InventoryItem) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2">
          <Image
            src={`https://bungie.net${item.image}`}
            width={16}
            height={16}
            alt={item.name}
          />
          <div className="space-y-1">
            <h3 className="text-slate-400 text-xs">{item.name}</h3>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="p-2 w-full bg-slate-800 max-w-64 break-words border-slate-700"
      >
        <p>{item.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export function InventoryItemIcon(item: InventoryItem) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Image
          src={`https://bungie.net${item.image}`}
          width={32}
          height={32}
          alt={item.name}
        />
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="p-2 w-full bg-slate-800 max-w-64 break-words border-slate-700"
      >
        <p>{item.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

"use client";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import Image from "next/image";

interface InventoryItemProps {
  item: DestinyInventoryItemDefinition;
}

export function InventoryItem({ item }: InventoryItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Image
          src={`https://bungie.net${item.displayProperties.icon}`}
          width={32}
          height={32}
          alt="item"
        />
        <div>
          <h4 className="text-sm text-slate-200">
            {item.displayProperties.name}
          </h4>
          <p className="text-xs text-slate-300">{item.itemTypeDisplayName}</p>
        </div>
      </div>
    </div>
  );
}

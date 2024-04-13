"use client";

import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { SubclassAbility } from "./subclass-ability";

interface SubclassContainerProps {
  heading: string;
  abilities: DestinyInventoryItemDefinition[];
  color: string;
}
export function SubclassContainer({
  heading,
  abilities,
  color,
}: SubclassContainerProps) {
  return (
    <div className="space-y-1">
      <h1 className="border-b border-slate-400 text-slate-400 uppercase text-xs font-bold">
        {heading}
      </h1>
      <div className="flex items-center gap-1 w-full bg-slate-900/50">
        {abilities.map((ability) => (
          <SubclassAbility key={ability.hash} ability={ability} color={color} />
        ))}
      </div>
    </div>
  );
}

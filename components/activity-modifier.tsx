"use client";

import { DestinyActivityModifierDefinition } from "bungie-api-ts/destiny2";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Image from "next/image";

export function ActivityModifier(modifier: DestinyActivityModifierDefinition) {
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild>
        <Image
          src={`https://bungie.net${modifier.displayProperties.icon}`}
          width={32}
          className="opacity-80 hover:opacity-100 transition-opacity"
          height={32}
          alt={modifier.displayProperties.name}
        />
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="p-2 w-full bg-slate-800 max-w-64 break-words border-slate-700"
      >
        <h3 className="font-semibold text-yellow-500 text-sm">
          {modifier.displayProperties.name}
        </h3>
        <p className="text-slate-300 font-light text-xs">
          {modifier.displayProperties.description}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

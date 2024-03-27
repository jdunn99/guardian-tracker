"use client";
import {
  DestinyPerkReference,
  DestinySandboxPerkDefinition,
} from "bungie-api-ts/destiny2";
import React from "react";

interface PerkProps {
  perk: DestinyPerkReference;
  manifest: Record<number, DestinySandboxPerkDefinition>;
}
export function Perk({ perk, manifest }: PerkProps) {
  const [hovered, setHovered] = React.useState<boolean>(false);

  if (!perk.visible) {
    return null;
  }

  return (
    <div
      className="relative w-full hover:text-yellow-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex items-center gap-1 cursor-context-menu text-slate-400 ${
          hovered ? "text-yellow-500" : ""
        }`}
      >
        <img src={`https://bungie.net${perk.iconPath}`} className="w-5 h-5" />
        <p className="text-xs">
          {manifest[perk.perkHash].displayProperties.name}
        </p>
      </div>
      {hovered ? (
        <div className="absolute text-xs w-72  top-6  text-slate-300 z-50 rounded p-2 bg-slate-900 border border-slate-700 shadow">
          {manifest[perk.perkHash].displayProperties.description}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { DestinyDisplayPropertiesDefinition } from "bungie-api-ts/destiny2";
import React from "react";

export function HoverItem(
  displayProperties: DestinyDisplayPropertiesDefinition
) {
  const [hovered, setHovered] = React.useState<boolean>(false);
  return (
    <div
      className="relative  hover:text-yellow-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex items-center gap-1 cursor-context-menu text-slate-400 ${
          hovered ? "text-yellow-500" : ""
        }`}
      >
        <img
          src={`https://bungie.net${displayProperties.icon}`}
          className="w-4 h-4"
        />
        <p className="text-xs">{displayProperties.name}</p>
      </div>
      {hovered && displayProperties.description !== "" ? (
        <div className="absolute text-xs w-72  top-6  text-slate-300 z-[100] rounded p-2 bg-slate-900 border border-slate-700 shadow">
          {displayProperties.description}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyStat } from "bungie-api-ts/destiny2";
import React from "react";

interface ItemStatProps {
  stat: DestinyStat;
  isArmor?: boolean;
  noBar?: boolean;
}

const WEAPON_STATS = [
  3614673599, 2523465841, 4043523819, 2837207746, 3022301683, 2762071195,
  3736848092, 1240592695, 155624089, 943549884, 4188031367, 925767036,
];

const ARMOR_STATS = [
  2996146975, 392767087, 1943323491, 1735777505, 144602215, 4244567218,
];

/**
 * WEAPONS:
 *  Blast Radius 3614673599
 *  Velocity 2523465841
 *  Impact 4043523819
 *  Swing Speed 2837207746
 *  Charge Rate
 *  Guard Efficiency
 *  Guard Endurance
 *  Range 1240592695
 *  Stablility 155624089
 *  Handling 943549884
 *  Reload Speed 4188031367
 *  Rounds per Minute 4284893193
 *  Magazine 3871231066
 *  Ammo Capacity
 *
 * ARMOR:
 *  Mobility
 *  Resilience
 *  Recovery
 *  Discipline
 *  Intellect
 *  Strength
 *  Total
 */

export function WeaponStats(stats: Record<number, DestinyStat>) {
  return (
    <React.Fragment>
      {WEAPON_STATS.map((stat) => (
        <ItemStat stat={stats[stat]} key={stat} />
      ))}
      <ItemStat stat={stats[4284893193]} noBar />
      <ItemStat stat={stats[3871231066]} noBar />
    </React.Fragment>
  );
}

export function ArmorStats(stats: Record<number, DestinyStat>) {
  const total = React.useMemo(() => {
    let total = 0;
    for (const stat of Object.values(stats)) {
      total += stat.value;
    }

    return total;
  }, [stats]);

  return (
    <React.Fragment>
      {ARMOR_STATS.map((stat) => (
        <ItemStat stat={stats[stat]} key={stat} isArmor />
      ))}

      <div className="grid grid-cols-2 gap-2 w-full items-center">
        <p className="text-right justify-self-end text-slate-400">Total</p>
        <div className="grid items-center grid-cols-9 gap-2">
          <p className="col-span-2">{total}</p>
        </div>
      </div>
    </React.Fragment>
  );
}

export function ItemStat({ stat, isArmor, noBar }: ItemStatProps) {
  const manifest = useManifest();

  if (!manifest || !stat) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-full items-center">
      <p className="text-right justify-self-end text-slate-400">
        {manifest.DestinyStatDefinition[stat.statHash].displayProperties.name}
      </p>
      <div className="grid items-center grid-cols-9 gap-2">
        {noBar ? null : (
          <div className="relative w-full h-4  bg-slate-500/50 col-span-7">
            <div
              style={{
                width: `${isArmor ? (stat.value / 42) * 100 : stat.value}%`,
              }}
              className={`absolute bg-white h-full inset-y-0`}
            />
          </div>
        )}
        <p className="col-span-2">
          {isArmor ? "+" : ""}
          {stat.value}
        </p>
      </div>
    </div>
  );
}

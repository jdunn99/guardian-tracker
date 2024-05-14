import { Card } from "@/components/ui/card";
import { $http } from "@/lib/bungie";
import { cn } from "@/lib/utils";
import {
  DestinyActivityModeType,
  DestinyStatsGroupType,
  getHistoricalStats,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";

async function getStatsForCharacter(args: StatsContainerProps) {
  const result = await getHistoricalStats($http, {
    ...args,
    modes: [
      DestinyActivityModeType.AllPvE,
      DestinyActivityModeType.AllPvP,
      DestinyActivityModeType.PvPCompetitive,
      DestinyActivityModeType.PvPQuickplay,
      DestinyActivityModeType.Gambit,
      DestinyActivityModeType.TrialsOfOsiris,
      DestinyActivityModeType.IronBanner,
      DestinyActivityModeType.Strike,
      DestinyActivityModeType.Raid,
      DestinyActivityModeType.Dungeon,
      DestinyActivityModeType.Story,
    ],
    groups: [1],
  });

  if (!result.Response) {
    throw new Error(result.ErrorStatus);
  }

  return result.Response;
}

function convertSeconds(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";
  if (days > 0) {
    result += days + "d ";
  }
  if (hours > 0) {
    result += hours + "h ";
  }
  if (minutes > 0) {
    result += minutes + "m";
  }

  return result.trim();
}

interface StatsContainerProps {
  destinyMembershipId: string;
  membershipType: number;
  characterId: string;
}

const keys = ["allPvP", "allPvE"];

const pvpModes = [
  {
    heading: "Competitive",
    key: "pvpCompetitive",
    icon: "https://www.bungie.net/common/destiny2_content/icons/d87bb6dbf6d9c5c851e1f06ef807b7d4.png",
    color: "from-red-500/20",
  },

  {
    heading: "Quickplay",
    key: "pvpQuickplay",
    icon: "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fb3e9149c43f7a2e8f8b66cbea7845fe.png",
    color: "from-red-500/20",
  },

  {
    heading: "Iron Banner",
    key: "ironBanner",
    icon: "https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_fe57052d7cf971f7502daa75a2ca2437.png",
    color: "from-green-300/20",
  },
  {
    heading: "Trials of Osiris",
    key: "trials_of_osiris",
    icon: "https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_42c55bbbfc5395f21659a899e3eca488.png",
    color: "from-yellow-300/20",
  },
];

const pveModes = [
  {
    heading: "Story",
    key: "story",
    icon: "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_5f8a923a0d0ac1e4289ae3be03f94aa2.png",
    color: "from-blue-500/20",
  },

  {
    heading: "Strike",
    key: "strike",
    icon: "https://www.bungie.net/common/destiny2_content/icons/3642cf9e2acd174dcab5b5f9e3a3a45d.png",
    color: "from-blue-500/20",
  },

  {
    heading: "Raid",
    key: "raid",
    icon: "https://www.bungie.net/common/destiny2_content/icons/bd7a1fc995f87be96698263bc16698e7.png",
    color: "from-green-300/20",
  },
  {
    heading: "Dungeon",
    key: "dungeon",
    icon: "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_f20ebb76bee675ca429e470cec58cc7b.png",
    color: "from-green-300/20",
  },
];

export async function StatsContainer(args: StatsContainerProps) {
  const stats = await getStatsForCharacter(args);

  let kills = 0;
  let assists = 0;
  let precisionKills = 0;
  let deaths = 0;
  let timePlayed = 0;

  for (const key of keys) {
    if (!stats[key]) {
      continue;
    }

    const stat = stats[key].allTime;

    if (!stat) {
      continue;
    }

    kills += stat.kills.basic.value;
    assists += stat.assists.basic.value;
    precisionKills += stat.precisionKills.basic.value;
    deaths += stat.deaths.basic.value;
    timePlayed += stat.secondsPlayed.basic.value;
  }

  return (
    <React.Fragment>
      <Card>
        <h5 className="text-xs uppercase text-yellow-500 font-bold">Stats</h5>
        <div className="grid grid-cols-5 gap-4 w-full">
          <div>
            <h1 className="text-xl font-bold text-white">
              {convertSeconds(timePlayed)}
            </h1>
            <h5 className="text-xs uppercase text-yellow-500 font-bold">
              Time played
            </h5>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {kills.toLocaleString()}
            </h1>
            <h5 className="text-xs uppercase text-yellow-500 font-bold">
              kills
            </h5>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              {precisionKills.toLocaleString()}
            </h1>
            <h5 className="text-xs uppercase text-yellow-500 font-bold">
              Precision Kills
            </h5>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {assists.toLocaleString()}
            </h1>
            <h5 className="text-xs uppercase text-yellow-500 font-bold">
              Assists
            </h5>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {deaths.toLocaleString()}
            </h1>
            <h5 className="text-xs uppercase text-yellow-500 font-bold">
              Deaths
            </h5>
          </div>
        </div>
      </Card>
      <div className="grid sm:grid-cols-2 gap-2">
        <Card className="p-0">
          <h5 className="text-xs uppercase text-yellow-500 font-bold px-4 pt-4">
            PVP Overview
          </h5>
          <div className="grid grid-cols-4 gap-4 p-4">
            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvP.allTime.activitiesEntered.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Matches
              </h5>
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvP.allTime.kills.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Kills
              </h5>
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvP.allTime.deaths.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Deaths
              </h5>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {(
                  (stats.allPvP.allTime.activitiesWon.basic.value /
                    stats.allPvP.allTime.activitiesEntered.basic.value) *
                  100
                )
                  .toString()
                  .slice(0, 4)}
                %
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Win Rate
              </h5>
            </div>
          </div>
          <div className="space-y-1">
            {pvpModes.map((mode) => {
              const key = stats[mode.key];

              return (
                <div
                  key={mode.key}
                  className={cn(
                    "flex items-center justify-between w-full bg-gradient-to-r to-transparent via-slate-800 px-4 py-2",
                    mode.color
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Image src={mode.icon} alt="icon" width={32} height={32} />
                    <div className="space-y-2">
                      <p className="text-slate-200 p-0">{mode.heading}</p>
                      <span className="text-xs text-slate-400 p-0">
                        {typeof key !== "undefined" &&
                        typeof key.allTime !== "undefined"
                          ? key.allTime.activitiesEntered.basic.value.toLocaleString()
                          : 0}{" "}
                        Matches
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-slate-300">
                    <div>
                      {typeof key !== "undefined" &&
                      typeof key.allTime !== "undefined"
                        ? key.allTime.kills.basic.value.toLocaleString()
                        : 0}{" "}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Kills
                      </h5>
                    </div>

                    <div>
                      {typeof key !== "undefined" &&
                      typeof key.allTime !== "undefined"
                        ? key.allTime.deaths.basic.value.toLocaleString()
                        : 0}{" "}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Deaths
                      </h5>
                    </div>
                    <div>
                      {typeof key !== "undefined" &&
                      typeof key.allTime !== "undefined"
                        ? (
                            (key.allTime.activitiesWon.basic.value /
                              key.allTime.activitiesEntered.basic.value) *
                            100
                          )
                            .toString()
                            .slice(0, 4)
                        : 0}
                      {"%"}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Win %
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-0">
          <h5 className="text-xs uppercase text-yellow-500 font-bold px-4 pt-4">
            PVE Overview
          </h5>
          <div className="grid grid-cols-4 gap-4 p-4">
            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvE.allTime.activitiesEntered.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Activities
              </h5>
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvE.allTime.kills.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Kills
              </h5>
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvE.allTime.deaths.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Deaths
              </h5>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {stats.allPvE.allTime.activitiesCleared.basic.value.toLocaleString()}
              </h1>
              <h5 className="text-[10px] uppercase text-yellow-500 font-bold">
                Clears
              </h5>
            </div>
          </div>
          <div className="space-y-1">
            {pveModes.map((mode) => {
              const key = stats[mode.key];

              return (
                <div
                  key={mode.key}
                  className={cn(
                    "flex items-center justify-between w-full bg-gradient-to-r to-transparent via-slate-800 px-4 py-2",
                    mode.color
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Image src={mode.icon} alt="icon" width={32} height={32} />
                    <div className="space-y-2">
                      <p className="text-slate-200 p-0">{mode.heading}</p>
                      <span className="text-xs text-slate-400 p-0">
                        {typeof key !== "undefined" &&
                        typeof key.allTime !== "undefined"
                          ? key.allTime.activitiesEntered.basic.value.toLocaleString()
                          : 0}{" "}
                        Activities
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-slate-300">
                    <div>
                      {typeof key !== "undefined" &&
                      typeof key.allTime !== "undefined"
                        ? key.allTime.kills.basic.value.toLocaleString()
                        : 0}{" "}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Kills
                      </h5>
                    </div>

                    <div>
                      {typeof key !== "undefined" &&
                      typeof key.allTime !== "undefined"
                        ? key.allTime.deaths.basic.value.toLocaleString()
                        : 0}{" "}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Deaths
                      </h5>
                    </div>
                    <div>
                      {key.allTime
                        ? key.allTime.activitiesCleared.basic.value.toLocaleString()
                        : 0}
                      <h5 className="text-yellow-500 text-[8px] font-bold uppercase">
                        Clears
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
}

import { $http, getManifest, getManifest2 } from "@/lib/bungie";
import {
  DestinyActivityRewardDefinition,
  getPublicMilestones,
} from "bungie-api-ts/destiny2";
import { Modifier } from "./modifier";
import { DamageIcons } from "./inventory-item";
import { parseActivityRewards } from "@/app/_components/milestones";
import { HoverItem } from "./hover-item";

const WEEKLY_NIGHTFALL_HASH = 2029743966;
export const SHIELD_ICONS = {
  Arc: DamageIcons[2],
  Solar: DamageIcons[3],
  Void: DamageIcons[4],
};

export const CHAMPION_ICONS = {
  "Shield-Piercing": {
    name: "Barrier",
    icon: "https://www.bungie.net/common/destiny2_content/icons/eb04e3267eee527d64d85af3f0a3ec6a.png",
  },
  Stagger: {
    name: "Unstoppable",
    icon: "https://www.bungie.net/common/destiny2_content/icons/9caeb47c43fbe011607af18409d8162f.png",
  },
  Disruption: {
    name: "Overload",
    icon: "https://www.bungie.net/common/destiny2_content/icons/f089fa44124cb8fe585acc5794653098.png",
  },
};

const REGEX = /(?<=\[).+?(?=\])/g;

async function parseModifiers(modiferHashes: number[]) {
  let shields: string[] = [];
  let champions: string[] = [];

  const { DestinyActivityModifierDefinition } = await getManifest2([
    "DestinyActivityModifierDefinition",
  ]);

  for (const hash of modiferHashes) {
    const hashed = DestinyActivityModifierDefinition[hash];
    if (hashed.displayInActivitySelection) {
      const { displayProperties } = hashed;

      if (displayProperties.name === "Shielded Foes") {
        shields = displayProperties.description.match(REGEX)! as string[];
      } else if (displayProperties.name === "Champion Foes") {
        champions = displayProperties.description.match(REGEX)! as string[];
      }
    }
  }

  return { shields, champions };
}

export async function WeeklyNightfall() {
  const milestones = await getPublicMilestones($http);
  const { DestinyActivityDefinition } = await getManifest();
  const { Response: data } = milestones;

  if (!data) {
    throw new Error("Error fetching milestones");
  }

  const nightfall = data[WEEKLY_NIGHTFALL_HASH];
  const [activity] = nightfall.activities;

  const hashed = DestinyActivityDefinition[activity.activityHash];

  const rewards = parseActivityRewards(hashed.rewards);
  const { shields, champions } = await parseModifiers(activity.modifierHashes);

  return (
    <div className="flex items-start gap-2 pt-3 shrink-0">
      <img
        src={`https://bungie.net${hashed.pgcrImage}`}
        className="w-24 h-24 border-slate-700 border shadow"
      />
      <div className="space-y-2">
        <h1 className="text-white font-semibold">
          {hashed.displayProperties.description}
        </h1>
        <div className="flex sm:flex-row flex-col gap-4 items-start flex-wrap">
          <div className="space-y-2">
            <p className="text-slate-300 font-medium text-sm">Shields</p>
            {shields?.map((shield) => (
              <div className="flex items-center gap-1" key={shield}>
                <img
                  src={SHIELD_ICONS[shield as keyof typeof SHIELD_ICONS]}
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">{shield}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-slate-300 text-sm font-medium">Champions</p>
            {champions.map((champion) => (
              <div className="flex items-center gap-1" key={champion}>
                <img
                  src={
                    CHAMPION_ICONS[champion as keyof typeof CHAMPION_ICONS].icon
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">
                  {CHAMPION_ICONS[champion as keyof typeof CHAMPION_ICONS].name}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-slate-300 font-medium text-sm">Rewards</p>
            {rewards.map((reward) => (
              <HoverItem {...reward.displayProperties} key={reward.hash} />
            ))}
          </div>
          {/* {activity.modifierHashes.map((hash) => (
            <Modifier hash={hash} key={hash} />
          ))} */}
        </div>
      </div>
    </div>
  );
}

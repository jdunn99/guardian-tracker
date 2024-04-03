import { $http, DamageType, getManifest } from "@/lib/bungie";
import {
  DestinyActivityRewardDefinition,
  DestinyInventoryItemDefinition,
  getPublicMilestones,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { ShieldIcon } from "@/components/icons/shields";
import { ChampionIcon, ChampionType } from "../../components/icons/champions";

const WEEKLY_NIGHTFALL_HASH = 2029743966;

const REGEX = /(?<=\[).+?(?=\])/g;

async function parseModifiers(modiferHashes: number[]) {
  let shields: string[] = [];
  let champions: string[] = [];

  const { DestinyActivityModifierDefinition } = await getManifest([
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
  const { DestinyActivityDefinition } = await getManifest([
    "DestinyActivityDefinition",
  ]);
  const { Response: data } = milestones;

  if (!data) {
    throw new Error("Error fetching milestones");
  }

  const nightfall = data[WEEKLY_NIGHTFALL_HASH];
  const [activity] = nightfall.activities;

  const hashed = DestinyActivityDefinition[activity.activityHash];

  const { shields, champions } = await parseModifiers(activity.modifierHashes);

  return (
    <div className="flex items-start gap-4">
      <Image
        src={`https://bungie.net${hashed.pgcrImage}`}
        className="w-32 h-32 object-cover border-slate-700 border "
        width={512}
        alt="img"
        height={512}
      />
      <div>
        <h3 className="text-xs uppercase text-yellow-500 font-bold">
          Nightfall this week
        </h3>
        <h1 className="text-white font-semibold text-xl inline-flex items-center gap-2">
          {hashed.displayProperties.description}
        </h1>

        <div className="flex sm:flex-row flex-col gap-4 items-start flex-wrap mt-2">
          <div className="space-y-2">
            <p className="text-slate-300 text-sm">Shields</p>
            {shields?.map((shield) => (
              <ShieldIcon key={shield} type={shield as DamageType} />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-slate-300 text-sm ">Champions</p>
            {champions.map((champion) => (
              <ChampionIcon key={champion} type={champion as ChampionType} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

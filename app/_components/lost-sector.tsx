import {
  CollectionItem,
  SmallInventoryItem,
} from "@/components/collection-item";
import { Countdown } from "@/components/countdown";
import { ShieldIcon } from "@/components/icons/shields";
import { $http, getManifest } from "@/lib/bungie";
import { db } from "@/lib/db";
import lostSectors from "@/lib/lost-sectors/lost-sectors.json";
import { searchDestinyEntities } from "bungie-api-ts/destiny2";
import Image from "next/image";
import { ChampionIcon } from "@/components/icons/champions";

type ElementType = "Arc" | "Solar" | "Void" | "Strand" | "Stasis";
type ArmorType = "Arms" | "Helmet" | "Chest" | "Legs";

const map = {
  Arms: "Exotic Gauntlets",
  Legs: "Exotic Leg Armor",
  Helmet: "Exotic Helmet",
  Chest: "Exotic Chest Armor",
};

type LostSectorData = {
  Date: number;
  "Lost Sector": string;
  Location: string;
  "Armor Type": ArmorType;
  Weapon: string;
  Threat: ElementType;
  Surge: ElementType;
  "Surge.1": ElementType;
  "Weapon Type": string;
  Shield: ElementType;
  "Shield.1": ElementType | "-";
  Barrier: string;
  Unstoppable: string;
  Overload: string;
  Legend: string;
  Master: string;
  Armor: string | null;
  "Armor.1": string | null;
  "Armor.2": string | null;
};

/**
 * Simply sets the reset time for the next lost sector.
 * Daily reset is always at 1pm EST.
 */
function getTime() {
  // Calculate reset time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(13, 0, 0, 0);

  return tomorrow;
}

/**
 * Gets the exotic armor reward associated with the lost sector.
 * Each lost sector has a possible exotic armor type reward.
 * @param type - The type of exotic the lost sector has as a reward
 */
async function getArmor(type: ArmorType) {
  const armor = await db.inventoryItem.findMany({
    where: {
      typeAndTier: map[type],
    },
    take: 4,
  });

  if (!armor) {
    throw new Error("Something went wrong fetching exotic armor");
  }

  return armor;
}

function getLostSectorData() {
  // Lost sector JSON is populated by Date.
  // Will eventually change this in the future and clean it up, but it works nicely for now.
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  const lostSector = lostSectors[
    date.getTime() as unknown as keyof typeof lostSectors
  ] as LostSectorData;

  return lostSector;
}

/**
 * Searches the Destiny 2 API for the name of the lost sector and returns the
 * associated image.
 */
async function getImageForLostSector(searchTerm: string) {
  const { DestinyActivityDefinition } = await getManifest([
    "DestinyActivityDefinition",
  ]);
  const { Response: data } = await searchDestinyEntities($http, {
    searchTerm: searchTerm,
    type: "DestinyActivityDefinition",
  });

  if (!data) {
    throw new Error(
      "Something went wrong fetching the Lost Sector's activity data"
    );
  }

  // We are getting the exact result so it will be the 1st element of the results array
  const [result] = data.results.results;
  return DestinyActivityDefinition[result.hash].pgcrImage;
}

export async function DailyLostSector() {
  const tomorrow = getTime();
  const lostSector = getLostSectorData();
  const pgcrImage = await getImageForLostSector(lostSector["Lost Sector"]);
  const armor = await getArmor(lostSector["Armor Type"]);

  return (
    <div className="flex items-start gap-4">
      <Image
        src={`https://bungie.net${pgcrImage}`}
        width={512}
        height={512}
        className="w-32 h-32 object-cover border border-slate-700"
        alt="img"
      />
      <div>
        <h3 className="text-xs uppercase text-yellow-500 font-bold">
          TODAY&apos;S LOST SECTOR
        </h3>
        <div className="!text-xs flex items-center gap-2 text-white pb-2">
          <span>Expires in</span> <Countdown end={tomorrow.toString()} />
        </div>
        <h1 className="text-white font-semibold text-xl inline-flex items-center gap-2">
          {lostSector["Lost Sector"]}
          <span className="ml-1 text-yellow-500 font-bold text-xs bg-slate-800 px-1 py-0.5 rounded">
            {lostSector.Location}
          </span>
        </h1>
        {/* <p className="text-xs text-slate-400 pt-2">{milestone.description}</p> */}
        <p className="text-sm text-slate-300 pt-2">Rewards</p>
        <div className="grid grid-cols-2 w-full gap-2 pt-2">
          {armor.map((armor) => (
            <SmallInventoryItem {...armor} key={armor.id} />
          ))}
        </div>

        <div className="flex items-start gap-4">
          <div className="space-y-2 pt-4">
            <p className="text-sm text-slate-300">Shields</p>
            <ShieldIcon type={lostSector.Shield} />

            {lostSector["Shield.1"] !== "-" ? (
              <ShieldIcon type={lostSector["Shield.1"]} />
            ) : null}
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-slate-300">Champions</p>
            {lostSector.Barrier !== "-" ? (
              <ChampionIcon type="Shield-Piercing" />
            ) : null}
            {lostSector.Overload !== "-" ? (
              <ChampionIcon type="Disruption" />
            ) : null}
            {lostSector.Unstoppable !== "-" ? (
              <ChampionIcon type="Stagger" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

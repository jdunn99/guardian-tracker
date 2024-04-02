import {
  CollectionItem,
  SmallInventoryItem,
} from "@/components/collection-item";
import { Countdown } from "@/components/countdown";
import { CHAMPION_ICONS, SHIELD_ICONS } from "@/components/nightfall";
import { $http, getManifest, getManifest2 } from "@/lib/bungie";
import { db } from "@/lib/db";
import lostSectors from "@/lib/lost-sectors/lost-sectors.json";
import { searchDestinyEntities } from "bungie-api-ts/destiny2";
import Image from "next/image";

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

const ARMOR_TYPE_ICONS = {
  Helmet: "",
  Chest: "",
  Legs: "",
  Arms: "",
};

export async function DailyLostSector() {
  const { DestinyActivityDefinition } = await getManifest2([
    "DestinyActivityDefinition",
  ]);

  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  // Calculate reset time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(13, 0, 0, 0);

  const lostSector = lostSectors[
    date.getTime() as unknown as keyof typeof lostSectors
  ] as LostSectorData;

  const { Response: data } = await searchDestinyEntities($http, {
    searchTerm: lostSector["Lost Sector"],
    type: "DestinyActivityDefinition",
  });

  if (!data) {
    throw new Error(
      "Something went wrong fetching the Lost Sector's activity data"
    );
  }

  const armor = await db.inventoryItem.findMany({
    where: {
      typeAndTier: map[lostSector["Armor Type"]],
    },
    take: 4,
  });

  const [result] = data.results.results;
  const { pgcrImage } = DestinyActivityDefinition[result.hash];

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
            <div className="flex items-center gap-1">
              <Image
                width={32}
                height={32}
                alt="shield"
                src={
                  SHIELD_ICONS[lostSector.Shield as keyof typeof SHIELD_ICONS]
                }
                className="w-4 h-4"
              />
              <span className="text-xs text-slate-400">
                {lostSector.Shield}
              </span>
            </div>

            {lostSector["Shield.1"] !== "-" ? (
              <div className="flex items-center gap-1">
                <Image
                  width={32}
                  height={32}
                  alt="shield"
                  src={
                    SHIELD_ICONS[
                      lostSector["Shield.1"] as keyof typeof SHIELD_ICONS
                    ]
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">
                  {lostSector["Shield.1"]}
                </span>
              </div>
            ) : null}
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-slate-300">Champions</p>
            {lostSector.Barrier !== "-" ? (
              <div className="flex items-center gap-1">
                <Image
                  src={CHAMPION_ICONS["Shield-Piercing"].icon}
                  width={32}
                  height={32}
                  alt="Barrier"
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">Barrier</span>
              </div>
            ) : null}
            {lostSector.Overload !== "-" ? (
              <div className="flex items-center gap-1">
                <Image
                  src={CHAMPION_ICONS["Disruption"].icon}
                  width={32}
                  height={32}
                  className="w-4 h-4"
                  alt="Overload"
                />
                <span className="text-xs text-slate-400">Overload</span>
              </div>
            ) : null}
            {lostSector.Unstoppable !== "-" ? (
              <div className="flex items-center gap-1">
                <Image
                  width={32}
                  height={32}
                  alt="Unstoppable"
                  src={CHAMPION_ICONS["Stagger"].icon}
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">Unstoppable</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="flex items-start gap-2">
    //     <Image
    //       src={`https://bungie.net${pgcrImage}`}
    //       className="w-32 h-32 border object-cover border-slate-700 shadow"
    //       alt="image"
    //       width={800}
    //       height={600}
    //     />
    //     <div className="space-y-2">
    //       <h1 className="text-white font-semibold">
    //         {lostSector["Lost Sector"]}
    //         <span className="ml-1 text-yellow-500 font-bold text-xs bg-slate-900 px-1 py-0.5 rounded">
    //           {lostSector.Location}
    //         </span>
    //       </h1>

    //       <div className="flex gap-4">
    //         {/* Shields */}
    //         <div className="space-y-2">
    //           <p className="text-slate-200 text-sm">Shields</p>

    //           <div className="flex items-center gap-1">
    //             <img
    //               src={
    //                 SHIELD_ICONS[lostSector.Shield as keyof typeof SHIELD_ICONS]
    //               }
    //               className="w-4 h-4"
    //             />
    //             <span className="text-xs text-slate-400">
    //               {lostSector.Shield}
    //             </span>
    //           </div>

    //           {lostSector["Shield.1"] !== "-" ? (
    //             <div className="flex items-center gap-1">
    //               <img
    //                 src={
    //                   SHIELD_ICONS[
    //                     lostSector["Shield.1"] as keyof typeof SHIELD_ICONS
    //                   ]
    //                 }
    //                 className="w-4 h-4"
    //               />
    //               <span className="text-xs text-slate-400">
    //                 {lostSector["Shield.1"]}
    //               </span>
    //             </div>
    //           ) : null}
    //         </div>
    //         <div className="space-y-2">
    //           <p className="text-slate-200 text-sm">Champions</p>
    //           {lostSector.Barrier !== "-" ? (
    //             <div className="flex items-center gap-1">
    //               <img
    //                 src={CHAMPION_ICONS["Shield-Piercing"].icon}
    //                 className="w-4 h-4"
    //               />
    //               <span className="text-xs text-slate-400">Barrier</span>
    //             </div>
    //           ) : null}
    //           {lostSector.Overload !== "-" ? (
    //             <div className="flex items-center gap-1">
    //               <img
    //                 src={CHAMPION_ICONS["Disruption"].icon}
    //                 className="w-4 h-4"
    //               />
    //               <span className="text-xs text-slate-400">Overload</span>
    //             </div>
    //           ) : null}
    //           {lostSector.Unstoppable !== "-" ? (
    //             <div className="flex items-center gap-1">
    //               <img
    //                 src={CHAMPION_ICONS["Stagger"].icon}
    //                 className="w-4 h-4"
    //               />
    //               <span className="text-xs text-slate-400">Unstoppable</span>
    //             </div>
    //           ) : null}
    //         </div>

    //         <div className="space-y-2">
    //           <p className="text-slate-200 text-sm">Threat</p>

    //           <div className="flex items-center gap-1">
    //             <img
    //               src={
    //                 SHIELD_ICONS[lostSector.Threat as keyof typeof SHIELD_ICONS]
    //               }
    //               className="w-4 h-4"
    //             />
    //             <span className="text-xs text-slate-400">
    //               {lostSector.Threat}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {/* <div className="mt-4">
    //     <p className="text-sm text-white">Time remaining</p>
    //   </div> */}
    // </div>
  );
}

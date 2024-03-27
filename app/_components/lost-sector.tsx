import { CHAMPION_ICONS, SHIELD_ICONS } from "@/components/nightfall";
import { $http, getManifest, getManifest2 } from "@/lib/bungie";
import lostSectors from "@/lib/lost-sectors/lost-sectors.json";
import { searchDestinyEntities } from "bungie-api-ts/destiny2";

type ElementType = "Arc" | "Solar" | "Void" | "Strand" | "Stasis";
type ArmorType = "Arms" | "Helment" | "Chest" | "Legs";

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

  const [result] = data.results.results;
  const { pgcrImage } = DestinyActivityDefinition[result.hash];

  return (
    <div className="flex items-start gap-2">
      <img
        src={`https://bungie.net${pgcrImage}`}
        className="w-16 h-16 border border-slate-700 shadow"
      />
      <div className="space-y-2">
        <h1 className="text-white font-semibold">
          {lostSector["Lost Sector"]}
          <span className="ml-1 text-yellow-500 font-bold text-xs bg-slate-900 px-1 py-0.5 rounded">
            {lostSector.Location}
          </span>
        </h1>
        <p className="text-slate-200 text-sm">
          Exotic Armor:{" "}
          <span className="text-yellow-500">{lostSector["Armor Type"]}</span>
        </p>

        <div className="flex gap-4">
          {/* Shields */}
          <div className="space-y-2">
            <p className="text-slate-200 text-sm">Shields</p>

            <div className="flex items-center gap-1">
              <img
                src={
                  SHIELD_ICONS[lostSector.Shield as keyof typeof SHIELD_ICONS]
                }
                className="w-4 h-4"
              />
              <span className="text-xs text-slate-400">
                {lostSector.Shield}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <img
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
          </div>
          <div className="space-y-2">
            <p className="text-slate-200 text-sm">Champions</p>
            {lostSector.Barrier !== "-" ? (
              <div className="flex items-center gap-1">
                <img
                  src={CHAMPION_ICONS["Shield-Piercing"].icon}
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">Barrier</span>
              </div>
            ) : null}
            {lostSector.Overload !== "-" ? (
              <div className="flex items-center gap-1">
                <img
                  src={CHAMPION_ICONS["Disruption"].icon}
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-400">Overload</span>
              </div>
            ) : null}
            {lostSector.Unstoppable !== "-" ? (
              <div className="flex items-center gap-1">
                <img src={CHAMPION_ICONS["Stagger"].icon} className="w-4 h-4" />
                <span className="text-xs text-slate-400">Unstoppable</span>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-slate-200 text-sm">Threat</p>

            <div className="flex items-center gap-1">
              <img
                src={
                  SHIELD_ICONS[lostSector.Threat as keyof typeof SHIELD_ICONS]
                }
                className="w-4 h-4"
              />
              <span className="text-xs text-slate-400">
                {lostSector.Threat}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

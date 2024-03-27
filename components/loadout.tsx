import {
  DestinyInventoryComponent,
  DestinyInventoryItemDefinition,
  DestinyItemPerksComponent,
  getDestinyManifest,
  getDestinyManifestComponent,
} from "bungie-api-ts/destiny2";
import { Container } from "./container";
import { $http, getManifest } from "@/lib/bungie";
import { InventoryItem } from "./inventory-item";
import { promises as fs } from "fs";

const EXCLUDED = [
  "Ghost",
  "Vehicle",
  "Ships",
  "Emblems",
  "Finishers",
  "Emotes",
];

interface DestinyLoadoutProps {
  itemData: Record<string, DestinyInventoryComponent>;
  perkData: Record<string, DestinyItemPerksComponent>;
}

export async function DestinyLoadout({
  itemData,
  perkData,
}: DestinyLoadoutProps) {
  // get most recently played character
  const key = Object.keys(itemData)[0];
  const equipment = itemData[key].items;

  const manifest = await getManifest();

  // Seems to work faster than directly importing the manifest
  const file = await fs.readFile(
    process.cwd() + "/app/inventorymanifest.json",
    "utf-8"
  );
  const inventoryManifest: Record<string, DestinyInventoryItemDefinition> =
    JSON.parse(file);

  // load the weapons
  // load the perks

  return (
    <Container heading="Loadout">
      <div className="space-y-4">
        {equipment.map((item) => (
          <InventoryItem
            perks={perkData}
            item={item}
            manifest={manifest}
            inventoryManifest={inventoryManifest}
            key={item.itemHash}
          />
        ))}
      </div>
      {/* <div className="space-y-2">
        {equipment.map(({ itemHash, bucketHash, ...rest }) => {
          const t = rest;

          const bucket = b[bucketHash];

          if (EXCLUDED.includes(bucket.displayProperties.name)) {
            return null;
          }

          const item = manifest[
            itemHash as keyof typeof manifest
          ] as DestinyInventoryItemDefinition;

          return (
            <div key={itemHash} className="flex gap-2">
              <img
                src={`https://bungie.net/${item.displayProperties.icon}`}
                alt="image"
                className="w-12 h-12"
              />
              <div>
                {item.displayProperties.name}
                {JSON.stringify(item.sockets?.socketEntries)}
                <div className="flex items-center gap-2">
                  {bucket.displayProperties.name === "Subclass" ? (
                    <div>
                      {item.perks.map((perk) =>
                        c[perk.perkHash].displayProperties.name !== "" ? (
                          <div
                            key={perk.perkHash}
                            className="flex items-center gap-1 text-xs text-slate-400"
                          >
                            <img
                              className="w-6 h-6"
                              src={`https://bungie.net/${
                                c[perk.perkHash].displayProperties.icon
                              }`}
                            />
                            {c[perk.perkHash].displayProperties.name}
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </Container>
  );
}

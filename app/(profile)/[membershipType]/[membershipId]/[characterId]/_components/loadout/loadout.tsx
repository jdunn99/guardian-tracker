import { CollectionItem } from "@/components/collection-item";
import { Card } from "@/components/ui/card";
import { getManifest } from "@/lib/bungie";
import { db } from "@/lib/db";
import {
  DestinyInventoryComponent,
  DestinyItemComponent,
  DestinyItemPerksComponent,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { InventoryItem } from "./inventory-item";

interface CharacterLoadoutProps {
  items: DestinyItemComponent[];
  perks: Record<string, DestinyItemPerksComponent>;
}

// Don't care about emotes, emblems, finishers, ghost, ship.
const EXCLUDED_BUCKETS = [
  1107761855, 3683254069, 4274335291, 284967655, 2025709351, 4023194814,
];

const SUBCLASS_HASH = 3284755031;
const WEAPONS_HASH = [1498876634, 2465295065, 953998645];

type ParsedData = {
  itemHash: number;
  itemInstanceId?: string;
};

/**
 * Parses the items into the format { Subclass, Weapons, Armor }
 * For a more organized structure
 * @param items - The character's inventory items
 */
function parseItems(items: DestinyItemComponent[]) {
  let Subclass = {} as ParsedData;
  let Weapons: ParsedData[] = [];
  let Armor: ParsedData[] = [];

  for (const { bucketHash, itemHash, itemInstanceId } of items) {
    // Skip everything included
    if (EXCLUDED_BUCKETS.includes(bucketHash)) {
      continue;
    }

    if (bucketHash === SUBCLASS_HASH) {
      Subclass = {
        itemHash,
        itemInstanceId,
      };
    } else if (WEAPONS_HASH.includes(bucketHash)) {
      Weapons.push({
        itemHash,
        itemInstanceId,
      });
    } else {
      Armor.push({
        itemHash,
        itemInstanceId,
      });
    }
  }

  return {
    Subclass,
    Weapons,
    Armor,
  };
}

export async function CharacterLoadout({
  items,
  perks,
}: CharacterLoadoutProps) {
  const { Subclass, Weapons, Armor } = parseItems(items);

  const manifest = await getManifest([
    "DestinyInventoryItemDefinition",
    "DestinySandboxPerkDefinition",
  ]);

  return (
    <Card>
      <h3 className=" text-slate-100 font-semibold pb-4">Loadout</h3>
      <div className="space-y-4">
        <h5 className="text-xs uppercase text-yellow-500 font-bold">
          Subclass
        </h5>
        <InventoryItem
          item={manifest.DestinyInventoryItemDefinition[Subclass.itemHash]}
        />

        <h5 className="text-xs uppercase text-yellow-500 font-bold">Weapons</h5>
        {Weapons.map(({ itemHash, itemInstanceId }) => (
          <div className="space-y-1" key={itemHash}>
            <InventoryItem
              key={itemHash}
              item={manifest.DestinyInventoryItemDefinition[itemHash]}
            />
            {itemInstanceId && perks[itemInstanceId] ? (
              <div className="flex items-center gap-2 flex-wrap">
                {perks[itemInstanceId].perks.map(({ perkHash, visible }) =>
                  visible ? (
                    <div
                      className="flex items-start gap-1 flex-wrap"
                      key={perkHash}
                    >
                      <Image
                        src={`https://bungie.net${manifest.DestinySandboxPerkDefinition[perkHash].displayProperties.icon}`}
                        width={16}
                        height={16}
                        alt="Perk"
                      />
                      <span className="text-xs text-slate-400">
                        {
                          manifest.DestinySandboxPerkDefinition[perkHash]
                            .displayProperties.name
                        }
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            ) : null}
          </div>
        ))}

        <h5 className="text-xs uppercase text-yellow-500 font-bold">Armor</h5>
        {Armor.map(({ itemHash }) => (
          <InventoryItem
            key={itemHash}
            item={manifest.DestinyInventoryItemDefinition[itemHash]}
          />
        ))}
      </div>
    </Card>
  );
}

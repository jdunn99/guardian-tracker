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

interface CharacterLoadoutProps {
  items: DestinyItemComponent[];
  perks: Record<string, DestinyItemPerksComponent>;
}

// Don't care about emotes, emblems, finishers, ghost, ship.
const EXCLUDED_BUCKETS = [
  1107761855, 3683254069, 4274335291, 284967655, 2025709351, 4023194814,
];

export async function CharacterLoadout({
  items,
  perks,
}: CharacterLoadoutProps) {
  const parsedItems = items
    .filter(({ bucketHash }) => !EXCLUDED_BUCKETS.includes(bucketHash))
    .map(({ itemHash, itemInstanceId }) => ({
      item: itemHash,
      itemInstanceId,
    }));

  const manifest = await getManifest([
    "DestinyInventoryItemDefinition",
    "DestinySandboxPerkDefinition",
  ]);

  return (
    <Card>
      <h3 className=" text-slate-100 font-semibold pb-4">Loadout</h3>
      <div className="space-y-4">
        {parsedItems.map(({ item, itemInstanceId }) => (
          <div key={item} className="space-y-1">
            <div className="flex items-center gap-1">
              <Image
                src={`https://bungie.net${manifest.DestinyInventoryItemDefinition[item].displayProperties.icon}`}
                width={32}
                height={32}
                alt="item"
              />
              <div>
                <h4 className="text-sm text-slate-200">
                  {
                    manifest.DestinyInventoryItemDefinition[item]
                      .displayProperties.name
                  }
                </h4>
                <p className="text-xs text-slate-300">
                  {
                    manifest.DestinyInventoryItemDefinition[item]
                      .itemTypeDisplayName
                  }
                </p>
              </div>
            </div>
            {typeof itemInstanceId !== "undefined" && perks[itemInstanceId] ? (
              <div className="flex gap-2 items-center">
                {perks[itemInstanceId].perks.map((perk) =>
                  perk.visible ? (
                    <div
                      key={perk.perkHash}
                      className="flex items-center gap-1"
                    >
                      <Image
                        src={`https://bungie.net${perk.iconPath}`}
                        width={16}
                        height={16}
                        alt="Perk"
                      />
                      <span className="text-slate-400 text-xs">
                        {
                          manifest.DestinySandboxPerkDefinition[perk.perkHash]
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
      </div>
    </Card>
  );
}

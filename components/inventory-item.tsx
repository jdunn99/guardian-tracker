import { Manifest } from "@/lib/bungie";
import {
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemPerksComponent,
} from "bungie-api-ts/destiny2";
import { Perk } from "./perk";

const DamageIcons = {
  1: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_3385a924fd3ccb92c343ade19f19a370.png",
  2: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png",
  3: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png",
  4: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png",
  6: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png",
  7: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_b2fe51a94f3533f97079dfa0d27a4096.png",
};

interface InventoryItemProps {
  manifest: Manifest;
  item: DestinyItemComponent;
  perks: Record<string, DestinyItemPerksComponent>;
  inventoryManifest: Record<string, DestinyInventoryItemDefinition>;
}
export function InventoryItem({
  inventoryManifest,
  manifest,
  item,
  perks,
}: InventoryItemProps) {
  const { itemInstanceId, itemHash } = item;
  const fetchedItem = inventoryManifest[itemHash];

  return (
    <div className="flex gap-2">
      <img
        src={`https://bungie.net/${fetchedItem.displayProperties.icon}`}
        alt="image"
        className="w-12 h-12"
      />
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{fetchedItem.displayProperties.name}</p>
          {fetchedItem.defaultDamageType ? (
            <img
              src={DamageIcons[fetchedItem.defaultDamageType as any]}
              className="w-4 h-4"
            />
          ) : null}
        </div>
        <div className="grid gap-2">
          {!!itemInstanceId && perks[itemInstanceId]
            ? perks[itemInstanceId].perks.map((perk) => (
                <Perk
                  manifest={manifest.DestinySandboxPerkDefinition}
                  perk={perk}
                  key={perk.perkHash}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

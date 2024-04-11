import {
  DestinyInventoryComponent,
  DestinyItemComponent,
  DestinyItemPerksComponent,
  ItemState,
} from "bungie-api-ts/destiny2";
import { CharacterSubclass } from "./character-subclass";

interface CharacterLoadoutProps {
  items: DestinyItemComponent[];
  perks: Record<string, DestinyItemPerksComponent>;
  membershipType: number;
  membershipId: string;
}

// Don't care about emotes, emblems, finishers, ghost, ship.
const EXCLUDED_BUCKETS = [
  1107761855, 3683254069, 4274335291, 284967655, 2025709351, 4023194814,
  4292445962, 1506418338,
];

const SUBCLASS_HASH = 3284755031;
const WEAPONS_HASH = [1498876634, 2465295065, 953998645];

type ParsedData = {
  itemHash: number;
  itemInstanceId?: string;
  state: ItemState;
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

  for (const { bucketHash, itemHash, itemInstanceId, state } of items) {
    // Skip everything included
    if (EXCLUDED_BUCKETS.includes(bucketHash)) {
      continue;
    }

    if (bucketHash === SUBCLASS_HASH) {
      Subclass = {
        itemHash,
        itemInstanceId,
        state,
      };
    } else if (WEAPONS_HASH.includes(bucketHash)) {
      Weapons.push({
        itemHash,
        itemInstanceId,
        state,
      });
    } else {
      Armor.push({
        itemHash,
        itemInstanceId,
        state,
      });
    }
  }

  return {
    Subclass,
    Weapons,
    Armor,
  };
}

export function CharacterLoadout({
  items,
  perks,
  membershipId,
  membershipType,
}: CharacterLoadoutProps) {
  const { Subclass, Weapons, Armor } = parseItems(items);

  return (
    <div className="w-full">
      <div className="space-y-4">
        <CharacterSubclass
          itemInstanceId={Subclass.itemInstanceId!}
          membershipId={membershipId}
          membershipType={membershipType}
        />
      </div>
    </div>
  );
}

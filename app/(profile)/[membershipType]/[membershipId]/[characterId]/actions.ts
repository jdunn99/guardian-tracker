import { $http } from "@/lib/bungie";
import {
  DestinyItemComponent,
  ItemState,
  getItem,
} from "bungie-api-ts/destiny2";

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
export function parseItems(items: DestinyItemComponent[]) {
  let subclass = {} as ParsedData;
  let weapons: ParsedData[] = [];
  let armor: ParsedData[] = [];

  for (const { bucketHash, itemHash, itemInstanceId, state } of items) {
    // Skip everything included
    if (EXCLUDED_BUCKETS.includes(bucketHash)) {
      continue;
    }

    if (bucketHash === SUBCLASS_HASH) {
      subclass = {
        itemHash,
        itemInstanceId,
        state,
      };
    } else if (WEAPONS_HASH.includes(bucketHash)) {
      weapons.push({
        itemHash,
        itemInstanceId,
        state,
      });
    } else {
      armor.push({
        itemHash,
        itemInstanceId,
        state,
      });
    }
  }

  return {
    subclass,
    weapons,
    armor,
  };
}

/**
 * Gets information about a requested User's inventory item.
 */
export async function getItemFromInstanceId(
  membershipId: string,
  membershipType: number,
  itemInstanceId?: string
) {
  if (!itemInstanceId) {
    throw new Error("Item InstanceID is missing!");
  }

  const result = await getItem($http, {
    components: [305, 307],
    destinyMembershipId: membershipId,
    membershipType,
    itemInstanceId,
  });

  if (!result.Response) {
    throw new Error("Something went wrong fetching the Subclass");
  }

  return result.Response;
}

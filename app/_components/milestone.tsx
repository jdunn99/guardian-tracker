import { CollectionItem } from "@/components/collection-item";
import { db } from "@/lib/db";
import {
  DestinyActivity,
  DestinyActivityType,
  InventoryItem,
} from "@prisma/client";
import Image from "next/image";

const HEADINGS: Record<DestinyActivityType, string> = {
  DUNGEON: "Weekly Dungeon Challenge",
  RAID: "Weekly Raid Challenge",
  EXOTIC_MISSION: "Weekly Exotic Mission",
  NIGHTFALL: "",
};

async function getExoticReward(exotic: bigint | null) {
  let reward: InventoryItem;

  if (exotic) {
    const result = await db.inventoryItem.findFirst({
      where: {
        collectibleHash: Number(exotic),
      },
    });

    if (result === null) {
      throw new Error("Something went wrong fetching the Exotic.");
    }

    reward = result;
  } else {
    reward = {
      collectibleHash: -1 as unknown as bigint,
      id: 1628271283 as unknown as bigint,
      name: "Pinnacle Gear",
      description: "Contains a random Pinnacle Legendary weapon or armor piece",
      image:
        "/common/destiny2_content/icons/3f3dd2345e79f296bd06cc960642a1ba.png",
      source: "World",
      damageType: 0,
      type: "Engram",
      typeAndTier: "Legendary Engram",
    };
  }

  return reward;
}

export async function Milestone(milestone: DestinyActivity) {
  const reward = await getExoticReward(milestone.exotic);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        <Image
          src={`https://bungie.net${milestone.image}`}
          width={512}
          height={512}
          className="w-32 h-32 object-cover border border-slate-700"
          alt="img"
        />
        <div>
          <h3 className="text-xs uppercase text-yellow-500 font-bold">
            {HEADINGS[milestone.activityType]}
          </h3>
          <h1 className="text-xl font-semibold text-white">{milestone.name}</h1>
          <p className="text-xs text-slate-400 pt-2">{milestone.description}</p>
          <div className="space-y-2 pt-4">
            <p className="text-sm text-slate-300">Rewards</p>
            <CollectionItem {...reward} />
          </div>
        </div>
      </div>
    </div>
  );
}

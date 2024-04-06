import {
  CollectionItem,
  SmallInventoryItem,
} from "@/components/collection-item";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  DestinyActivity,
  DestinyActivityType,
  InventoryItem,
} from "@prisma/client";
import { Check } from "lucide-react";
import Image from "next/image";

export const ACTIVITY_HEADINGS: Record<DestinyActivityType, string> = {
  DUNGEON: "Weekly Dungeon",
  RAID: "Weekly Raid",
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

interface MilestoneProps {
  milestone: DestinyActivity;
  variant?: "small" | "base";
  children?: React.ReactNode;
}

export async function Milestone({
  milestone,
  variant = "base",
  children,
}: MilestoneProps) {
  const reward = await getExoticReward(milestone.exotic);

  return (
    <div className="flex items-start gap-4 w-full ">
      <Image
        src={`https://bungie.net${milestone.image}`}
        width={512}
        height={512}
        className={cn(
          "object-cover, border border-slate-700",
          variant === "base" ? "w-32 h-32" : "h-12 w-12"
        )}
        alt="img"
      />
      <div className="flex-1">
        <h3 className="text-xs uppercase text-yellow-500 font-bold">
          {ACTIVITY_HEADINGS[milestone.activityType]}
        </h3>
        <h1
          className={cn(
            "text-white font-semibold",
            variant === "base" ? "text-xl" : "text-sm"
          )}
        >
          {milestone.name}
        </h1>
        {variant === "base" ? (
          <p className="text-xs text-slate-400 pt-2">{milestone.description}</p>
        ) : null}
        <div className="space-y-2 pt-4">
          <p className="text-sm text-slate-300">Rewards</p>
          {variant === "base" ? (
            <CollectionItem {...reward} />
          ) : (
            <SmallInventoryItem {...reward} />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

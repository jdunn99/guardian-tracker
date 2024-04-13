"use client";

import useSWR from "swr";
import { DestinyItem, DestinyItemProps } from "./destiny-item";
import { getItemFromInstanceId } from "@/app/(profile)/[membershipType]/[membershipId]/[characterId]/actions";
import { DestinyItemSkeleton } from "./loading/destiny-item-skeleton";
import { useManifest } from "@/lib/manifest/useManifest";
import { DestinyDamageTypeDefinition } from "bungie-api-ts/destiny2";

interface DestinyInstancedItemProps extends DestinyItemProps {
  itemInstanceId: string;
  membershipId: string;
  membershipType: number;
  damageType: DestinyDamageTypeDefinition | null;
}

const COLORS = {
  Common: "#c2bbb2",
  Uncommon: "#336b3e",
  Rare: "#567e9d",
  Legendary: "#4f3663",
  Exotic: "#cdad36",
};

export function DestinyInstancedItem({
  item,
  state,
  color,
  damageType,
  itemInstanceId,
  membershipId,
  membershipType,
}: DestinyInstancedItemProps) {
  const { data } = useSWR(itemInstanceId, () =>
    getItemFromInstanceId(membershipId, membershipType, itemInstanceId)
  );

  const manifest = useManifest();

  if (!data || !manifest) {
    return <DestinyItemSkeleton />;
  }

  return (
    <DestinyItem item={item} state={state}>
      {JSON.stringify(data)}
    </DestinyItem>
  );
}

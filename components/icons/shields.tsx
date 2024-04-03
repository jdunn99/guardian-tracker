"use client";
import { DamageType } from "@/lib/bungie";
import { Icon } from "./icon";

export const SHIELD_ICON_IMAGES: Record<DamageType, string> = {
  Arc: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png",
  Solar:
    "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png",
  Stasis:
    "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png",
  Strand:
    "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_b2fe51a94f3533f97079dfa0d27a4096.png",
  Void: "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png",
};

export function ShieldIcon({ type }: { type: DamageType }) {
  return <Icon src={SHIELD_ICON_IMAGES[type]} value={type} />;
}

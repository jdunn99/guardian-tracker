"use client";
import { Icon } from "./icon";

// These names come from descriptions of Destiny activities and map to more commonly know names of champions
export type ChampionType = "Shield-Piercing" | "Stagger" | "Disruption";

export const CHAMPION_ICONS = {
  "Shield-Piercing": {
    name: "Barrier",
    icon: "https://www.bungie.net/common/destiny2_content/icons/eb04e3267eee527d64d85af3f0a3ec6a.png",
  },
  Stagger: {
    name: "Unstoppable",
    icon: "https://www.bungie.net/common/destiny2_content/icons/9caeb47c43fbe011607af18409d8162f.png",
  },
  Disruption: {
    name: "Overload",
    icon: "https://www.bungie.net/common/destiny2_content/icons/f089fa44124cb8fe585acc5794653098.png",
  },
};

export function ChampionIcon({ type }: { type: ChampionType }) {
  return (
    <Icon src={CHAMPION_ICONS[type].icon} value={CHAMPION_ICONS[type].name} />
  );
}

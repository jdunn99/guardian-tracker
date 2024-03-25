import {
  DestinyPerkReference,
  DestinySandboxPerkDefinition,
} from "bungie-api-ts/destiny2";

interface PerkProps {
  perk: DestinyPerkReference;
  manifest: Record<number, DestinySandboxPerkDefinition>;
}
export async function Perk({ perk, manifest }: PerkProps) {
  if (!perk.visible) {
    return null;
  }

  return (
    <div className="flex items-start gap-1">
      <img src={`https://bungie.net${perk.iconPath}`} className="w-5 h-5" />
      <p className="text-xs text-slate-400">
        {manifest[perk.perkHash].displayProperties.name}
      </p>
    </div>
  );
}

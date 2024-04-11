import { useManifest } from "@/lib/manifest/useManifest";

interface DestinyPerkProps {
  perkHash: number;
}
export function DestinyPerk({ perkHash }: DestinyPerkProps) {
  const manifest = useManifest();

  if (!manifest) {
    // return <PerkSkeleton />
    return null;
  }

  if (!manifest.DestinySandboxPerkDefinition) {
    throw new Error("Something went wrong loading the perks!");
  }

  const perk = manifest.DestinySandboxPerkDefinition[perkHash];

  return <div className="flex items-center gap-2"></div>;
}

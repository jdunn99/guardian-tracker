import { getManifest } from "@/lib/bungie";
import { HoverItem } from "./hover-item";

interface ModifierProps {
  hash: number;
}
export async function Modifier({ hash }: ModifierProps) {
  const { DestinyActivityModifierDefinition } = await getManifest();

  const { displayProperties } = DestinyActivityModifierDefinition[hash];
  console.log(hash, displayProperties);

  return <HoverItem {...displayProperties} />;
}

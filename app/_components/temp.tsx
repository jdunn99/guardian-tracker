import { ActivityModifier } from "@/components/activity-modifier";
import { CollectionItem } from "@/components/collection-item";
import { getManifest2 } from "@/lib/bungie";
import { Seed } from "@/prisma/seed";
import { DestinyPresentationNodeDefinition } from "bungie-api-ts/destiny2";
import inventoryManifest from "@/app/inventoryManifest.json";

export async function Temp() {
  // const manifest = await getManifest2([
  //   "DestinyCollectibleDefinition",
  //   "DestinyInventoryItemDefinition",
  // ]);
  // const result = await Seed();

  // console.log(result);
  // return (
  //   <div className="text-white">
  //     {Object.keys(result).map((key) => (
  //       <div key={key}>
  //         <h3 className="text-xs font-bold text-yellow-500">{key}</h3>
  //         {(
  //           result[key] as DestinyPresentationNodeDefinition
  //         ).children.collectibles.map((collection) => (
  //           <div
  //             key={collection.collectibleHash}
  //             className="text-xs text-slate-400"
  //           >
  //             {manifest.DestinyCollectibleDefinition[collection.collectibleHash]
  //               .scope === 1 ? (
  //               <CollectionItem
  //                 {...manifest.DestinyInventoryItemDefinition[
  //                   manifest.DestinyCollectibleDefinition[
  //                     collection.collectibleHash
  //                   ].itemHash
  //                 ]}
  //               />
  //             ) : null}
  //           </div>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  return null;
}

import { getManifest } from "@/lib/bungie";
import { db } from "@/lib/db";
import { DestinyActivityType } from "@prisma/client";

const Exotics: Record<number, number | null> = {
  478604913: null, // Prophecy - None
  390471874: 161963863, // Ghosts of the Deep - Navigator
  526718853: 3558330464, // Spire of the Watcher - Hierarchy of Needs
  422102671: 1258579677, // Pit of Heresy - Xenophage
  1092691445: 4027219968, // Grasp of Avarice - Gjallarhorn
  3618845105: 467760883, // Duality - Heartshadow
  3921784328: 3275654322, // Warlord's Ruin - Buried Bloodline
  1742973996: 1660030044, // Shattered throne - Wish-Ender
  2712317338: 1988948484, // Garden of Salvation - Divinity
  1888320892: 2300465938, // Vault of Glass - Vex Mythoclast
  540415767: 203521123, // Crota's End - Necrochasm
  292102995: 192937277, // King's Fall - Touch of Malice
  541780856: 753200559, // Deep stone crypt - Eyes of Tomorrow
  3181387331: 199171385, // Last Wish - One Thousand Voices
  3699252268: 2553509474, // Root of Nightmares - Conditional Finality
  2136320298: 2817568609, // Vow of the Discipe - Collective Obligation
  3883295757: 2143216566, // Presage - Dead Man's Tale
  901429423: 360554695, // Vox Obscura - Dead Messenger
  202306511: 760708739, // Operation Seraphs Shield - Revision Zero
};

const Dungeons = [
  "Prophecy",
  "Ghosts of the Deep",
  "Spire of the Watcher",
  "Pit of Heresy",
  "Grasp of Avarice",
  "Duality",
  "Warlord's Ruin",
];

export async function Seed() {
  const { DestinyInventoryItemDefinition, DestinyCollectibleDefinition } =
    await getManifest([
      "DestinyInventoryItemDefinition",
      "DestinyCollectibleDefinition",
    ]);

  const aggregate = [];

  for (const key in DestinyInventoryItemDefinition) {
    if (DestinyInventoryItemDefinition.hasOwnProperty(key)) {
      const item = DestinyInventoryItemDefinition[key];
      if (item.displayProperties.name === "" || !item.collectibleHash) {
        continue;
      }

      const collectible = DestinyCollectibleDefinition[item.collectibleHash];

      aggregate.push({
        id: parseInt(key),
        name: item.displayProperties.name,
        description: item.displayProperties.description,
        image: item.displayProperties.icon,
        typeAndTier: item.itemTypeAndTierDisplayName,
        type: item.itemTypeDisplayName,
        source: collectible.sourceString,
        collectibleHash: item.collectibleHash,
        damageType: item.defaultDamageType,
      });
    }
  }

  await db.inventoryItem.createMany({
    data: aggregate,
  });
}

// export async function Seed() {
//   const manifest = await getManifest([
//     "DestinyMilestoneDefinition",
//     "DestinyActivityDefinition",
//     "DestinyCollectibleDefinition",
//   ]);

//   const aggregate: any[] = [];

//   for (const _key of Object.keys(Exotics)) {
//     // Each key represents a Milestone hash
//     const key = parseInt(_key); // Because Object.keys forces to strings
//     let type: DestinyActivityType = DestinyActivityType.RAID;
//     let name = "";
//     let description = "";
//     let image = "";

//     // First we parse milestone to get Dungeons & Raids.
//     // If we don't have a hit here, we parse activities to get Exotic Mission
//     const milestone = manifest.DestinyMilestoneDefinition[key];

//     if (!milestone) {
//       const activity = manifest.DestinyActivityDefinition[key];

//       const split = activity.displayProperties.name.split(":");

//       name = split.splice(0, split.length - 1).join();
//       description = activity.displayProperties.description;
//       image = activity.pgcrImage;
//       type = DestinyActivityType.EXOTIC_MISSION;
//     } else {
//       name = milestone.displayProperties.name;

//       if (Dungeons.includes(name)) {
//         type = DestinyActivityType.DUNGEON;
//       }

//       const activities = milestone.activities;
//       const [{ activityHash }] = activities;

//       const activity = manifest.DestinyActivityDefinition[activityHash];
//       description = activity.displayProperties.description;
//       image = activity.pgcrImage;
//     }

//     aggregate.push({
//       id: key,
//       exotic: Exotics[key],
//       name,
//       activityType: type,
//       description,
//       image,
//     });
//   }

//   await db.destinyActivity.createMany({
//     data: aggregate,
//   });
// }

// function recurse(
//   node: DestinyPresentationNodeDefinition,
//   manifest: Record<number, DestinyPresentationNodeDefinition>,
//   tree: any
// ) {
//   if (node.children.presentationNodes.length === 0) {
//     return node;
//   }

//   const result = node.children.presentationNodes.reduce((acc: any, curr) => {
//     const child = manifest[curr.presentationNodeHash];
//     acc[child.displayProperties.name] = recurse(child, manifest, {});
//     return acc;
//   }, {});

//   return result;
// }

// // Build a manifest of weapons, armor, exotic, etc.
// export async function Seed() {
//   const manifest = await getManifest(["DestinyPresentationNodeDefinition"]);
//   const { Response } = await getCommonSettings($http);

//   // PresentationNode "Items"
//   const node = manifest.DestinyPresentationNodeDefinition[1154828558];

//   return recurse(node, manifest.DestinyPresentationNodeDefinition, {});
// }

// export async function Seed() {
// just the function calls from bray.tech
// const milestones = await getPublicMilestones($http);
// const settings = await getCommonSettings($http);

// 100,200,202,204,205,300,800,900,1000,1400
// }

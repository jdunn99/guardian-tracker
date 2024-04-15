"use client";

/**
 * These functions operate on the browser to provide
 * basic cache functionality (IndexedDB & localStorage) for fetching the manfiests
 */

import {
  AllDestinyManifestComponents,
  DestinyManifest,
} from "bungie-api-ts/destiny2";
import { set, get } from "idb-keyval";
import { getManifestFromBungieAPI, getCurrentManifest } from "./actions";

export const MANIFEST_TABLE_NAMES: Slice[] = [
  "DestinyInventoryItemDefinition",
  "DestinyActivityDefinition",
  "DestinySandboxPerkDefinition",
  "DestinyObjectiveDefinition",
  "DestinyRecordDefinition",
  "DestinyActivityModifierDefinition",
  "DestinyActivityModeDefinition",
  "DestinyCollectibleDefinition",
  "DestinyClassDefinition",
  "DestinyRaceDefinition",
  "DestinyDamageTypeDefinition",
  "DestinyMilestoneDefinition",
  "DestinySeasonDefinition",
  "DestinyGuardianRankDefinition",
  "DestinySeasonPassDefinition",
  "DestinyProgressionDefinition",
  "DestinyActivityTypeDefinition",
  "DestinyPresentationNodeDefinition",
  "DestinyStatDefinition",
];
export type Slice = keyof AllDestinyManifestComponents;
const key = "destiny-manifest";

/**
 * Writes the manifest and content path (version) to the cache
 * @param manifest
 * @param contentPath
 */
async function writeManifestToCache(
  manifest: Partial<AllDestinyManifestComponents>,
  contentPath: string
) {
  await set(key, manifest);
  localStorage.setItem("content-path", contentPath);
}

/**
 * Attempt to load the manifest from IndexedDB cache.
 * Fallsback to getting the manifests from the Bungie API and writes to the cache if something fails.
 * @param destinyManifest
 * @param contentPath
 */
async function getManifestFromCache(
  destinyManifest: DestinyManifest,
  contentPath: string
) {
  const manifest = await get<AllDestinyManifestComponents>(key);

  if (!manifest) {
    const newManifest = await getManifestFromBungieAPI(
      destinyManifest,
      MANIFEST_TABLE_NAMES
    );
    await writeManifestToCache(newManifest, contentPath);

    return newManifest;
  }

  return manifest;
}

/**
 * Loads the Destiny 2 manifest into the client.
 */
export async function loadManifests() {
  const destinyManifest = await getCurrentManifest();
  const cachedContentPath = localStorage.getItem("content-path");
  const path = destinyManifest.jsonWorldContentPaths.en;

  // Cache needs to be invalidated and the manifest needs to be rewritten
  if (!cachedContentPath || path !== cachedContentPath) {
    const manifest = await getManifestFromBungieAPI(
      destinyManifest,
      MANIFEST_TABLE_NAMES
    );

    await writeManifestToCache(manifest, path);
    return manifest;
  }

  return await getManifestFromCache(destinyManifest, path);
}

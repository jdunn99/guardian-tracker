"use server";

import {
  DestinyManifest,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { getCommonSettings as getDestinySettings } from "bungie-api-ts/core";
import { $http } from "../bungie";
import { Slice } from "./loadManifest";

/**
 * Represents server actions for reading the Desriny 2 manifest.
 * Until I resolve the CORS configuration for fetching the content from the manifest
 * using client components, these will remain server actions
 */

/**
 * Downloads the current manifest definitions from the Bungie API
 */
export async function getCurrentManifest() {
  const { Response, Message } = await getDestinyManifest($http);

  if (!Response) {
    throw new Error(Message);
  }

  return Response;
}

/**
 * For each slice in the manifest. Download them in parallel using bungie-api-ts
 * @param destinyManifest - The current manifest definitions
 * @param tableNames - The content we are fetching
 * @returns - The content from the manifest
 */
export async function getManifestFromBungieAPI(
  destinyManifest: DestinyManifest,
  tableNames: Slice[]
) {
  const slices = await getDestinyManifestSlice($http, {
    destinyManifest,
    language: "en",
    tableNames,
  });

  return slices;
}

/**
 * Loads the Destiny 2 settings which provides root nodes of all data in the manifest
 */
export async function getCommonSettings() {
  const { Response } = await getDestinySettings($http);

  if (!Response) {
    throw new Error("Something went wrong fetching the settings");
  }

  return Response;
}

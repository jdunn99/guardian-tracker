"use server";

import { $http } from "@/lib/bungie";
import {
  DestinyManifest,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import type { Slice } from "./page";

export async function getCurrentManifest() {
  const { Response, Message } = await getDestinyManifest($http);

  if (!Response) {
    throw new Error(Message);
  }

  return Response;
}

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

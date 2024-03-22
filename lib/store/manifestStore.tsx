"use client";

import {
  DestinyManifestSlice,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { create } from "zustand";
import { $http } from "../bungie";

interface GlobalManifest {
  manifest: DestinyManifestSlice<"DestinyInventoryItemDefinition"[]> | null;
  fetch(): Promise<void>;
}

export const useManifestStore = create<GlobalManifest>((set) => ({
  manifest: null,
  fetch: async () => {
    const destinyManifest = await getDestinyManifest($http);
    const manifest = await getDestinyManifestSlice($http, {
      destinyManifest: destinyManifest.Response,
      tableNames: ["DestinyInventoryItemDefinition"],
      language: "en",
    });

    set({ manifest });
  },
}));

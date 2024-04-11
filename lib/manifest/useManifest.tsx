"use client";

import { DestinyManifestSlice } from "bungie-api-ts/destiny2";
import { Slice, loadManifests } from "./loadManifest";
import React from "react";

const ManifestContext = React.createContext<
  DestinyManifestSlice<Slice[]> | undefined
>(undefined);

/**
 * Load the manifest and store it in Context,
 * allowing client components to access the manifest
 */
export function ManifestProvider({ children }: { children: React.ReactNode }) {
  const [manifest, setManifest] =
    React.useState<DestinyManifestSlice<Slice[]>>();

  /**
   * Fetch the manifest and store it in the state value
   */
  async function fetchData() {
    const result = await loadManifests();
    setManifest(result);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ManifestContext.Provider value={manifest}>
      {children}
    </ManifestContext.Provider>
  );
}

/**
 * Wrapper around React.useContext to get the manifest in client components
 */
export function useManifest() {
  return React.useContext(ManifestContext);
}

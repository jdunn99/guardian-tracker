import { $http } from "@/lib/bungie";
import { useManifestStore } from "@/lib/store/manifestStore";
import {
  BungieMembershipType,
  DestinyComponentType,
  getDestinyManifest,
  getDestinyManifestSlice,
  getProfile,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { Suspense } from "react";

async function Test() {
  const result = await getDestinyManifest($http);

  return <p>{JSON.stringify(result.Response)}</p>;
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <div className="max-w-screen-lg mx-auto break-words">
        <Test />
      </div>
    </main>
  );
}

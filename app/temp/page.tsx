"use client";

import { $http } from "@/lib/bungie";
import { getProfile } from "bungie-api-ts/destiny2";
import React from "react";

import useSWR from "swr";
import { DestinyItem } from "@/components/destiny/destiny-item";

const CHARACTER = "2305843009470704841";

async function fetchData() {
  const { Response } = await getProfile($http, {
    components: [302, 305, 304, 205],
    destinyMembershipId: "4611686018443584447",
    membershipType: 1,
  });

  if (!Response) {
    throw new Error("Something went wrong fetching the result");
  }

  return { profile: Response };
}

export default function Page() {
  const { data } = useSWR("testing", fetchData);

  if (!data) {
    return null;
  }

  const item = data.profile.characterEquipment.data![CHARACTER].items[0];

  return (
    <div className="bg-slate-800 p-8">
      <DestinyItem item={item} />
    </div>
  );
}

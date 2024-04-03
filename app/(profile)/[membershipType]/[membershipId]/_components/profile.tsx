"use client";
import { PlatformIcons } from "@/lib/bungie";
import { DestinyProfileComponent } from "bungie-api-ts/destiny2";
import React from "react";

export function Profile(profile: DestinyProfileComponent) {
  return (
    <div className="space-y-2 mb-8">
      <div className="text-xs uppercase text-yellow-500 font-bold">Profile</div>
      <h1 className="text-3xl font-bold">
        {profile.userInfo.bungieGlobalDisplayName}

        <span className="ml-2 text-xl text-yellow-500 font-semibold">
          #{profile.userInfo.bungieGlobalDisplayNameCode}
        </span>
      </h1>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {profile.userInfo.applicableMembershipTypes.map(
          (membership) => PlatformIcons[membership as unknown as any]
        )}
      </div>
    </div>
  );
}

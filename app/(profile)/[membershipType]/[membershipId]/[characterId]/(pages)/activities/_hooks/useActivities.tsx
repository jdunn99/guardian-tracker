"use client";

import useSWR from "swr";
import { getRecentActivities } from "../../../_components/activities/activity-history";
import { useFilters } from "../filter/filterContext";
import { Props } from "../../../page";
import { useManifest } from "@/lib/manifest/useManifest";
import React from "react";

export function useActivities({
  params: { characterId, membershipId, membershipType },
}: Props) {
  const { filters } = useFilters();
  const manifest = useManifest();

  const { data, error } = useSWR(
    characterId + "/activities" + filters.activityMode,
    () =>
      getRecentActivities({
        characterId,
        membershipType: parseInt(membershipType),
        destinyMembershipId: membershipId,
        mode:
          filters.activityMode && manifest
            ? manifest.DestinyActivityModeDefinition[
                parseInt(filters.activityMode)
              ].modeType
            : undefined,
      })
  );

  const filteredData = React.useMemo(() => {}, []);

  if (error) {
    throw new Error(error);
  }

  return data;
}

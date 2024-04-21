"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useManifest } from "@/lib/manifest/useManifest";
import {
  DestinyHistoricalStatsActivity,
  DestinyHistoricalStatsPeriodGroup,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import { getPGCR } from "./actions";
import { cn } from "@/lib/utils";
import { PostGameCarnageReport } from "./post-game-carnage/post-game-carnage-report";

export function ActivityItem(activity: DestinyHistoricalStatsPeriodGroup) {
  const manifest = useManifest();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // TODO: Skeleton
  if (!manifest) {
    return null;
  }

  const activityDefintion =
    manifest.DestinyActivityDefinition[activity.activityDetails.referenceId];

  if (!activityDefintion || !activityDefintion.directActivityModeHash) {
    return null;
  }

  const activityType =
    manifest.DestinyActivityModeDefinition[
      manifest.DestinyActivityDefinition[
        activity.activityDetails.directorActivityHash
      ].directActivityModeHash!
    ];

  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={() => setIsOpen(!isOpen)}
    >
      <AccordionItem value={activity.period} className="border-0 ">
        <AccordionTrigger
          className={cn(
            "text-white hover:bg-slate-700/50 px-4 data-[state=open]:bg-slate-700/50 bg-slate-700/20",
            activity.values.standing
              ? activity.values.standing.basic.displayValue === "Victory"
                ? "border-l-2 border-green-500"
                : "border-l-2 border-red-500"
              : ""
          )}
        >
          <div className="flex gap-4 items-center text-left">
            <Image
              src={`https://bungie.net${activityType.displayProperties.icon}`}
              width={32}
              height={32}
              alt="icon"
            />
            <div>
              <h3 className="text-white font-semibold">
                {activityType.displayProperties.name}
              </h3>
              <p className="text-slate-300 text-sm">
                {activityDefintion.displayProperties.name}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-slate-700/30">
          {isOpen ? (
            <PostGameCarnageReport
              activity={activity}
              activityDefinition={activityDefintion}
              activityType={activityType}
            />
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

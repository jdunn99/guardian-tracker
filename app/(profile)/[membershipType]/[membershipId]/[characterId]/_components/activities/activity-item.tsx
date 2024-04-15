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

export function ActivityItem(activity: DestinyHistoricalStatsPeriodGroup) {
  const manifest = useManifest();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { data } = useSWR(isOpen ? activity.period : null, () =>
    getPGCR(activity.activityDetails.instanceId)
  );

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
      <AccordionItem value={activity.period} className="border-0 p-2">
        <AccordionTrigger
          className={cn(
            "text-white hover:bg-slate-700/30 px-4 data-[state=open]:bg-slate-700/30 bg-slate-700/20",
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
          <div
            className={cn(
              "w-full h-64 relative bg-gradient-to-b from-slate-800 to-black",
              activity.values.standing
                ? activity.values.standing.basic.displayValue === "Victory"
                  ? "to-green-900"
                  : "to-red-900"
                : "to-black"
            )}
          >
            <div
              className="w-full h-full absolute opacity-40"
              style={{
                backgroundImage: `url("https://bungie.net${activityDefintion.pgcrImage}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="absolute bottom-8 left-8">
              <Image
                src={`https://bungie.net${activityType.displayProperties.icon}`}
                className="pb-2"
                width={48}
                height={48}
                alt="icon"
              />
              <h5 className="text-xs font-bold text-yellow-500 uppercase">
                {activityType.displayProperties.name}
              </h5>
              <h1 className="text-3xl text-white font-bold">
                {activityDefintion.displayProperties.name}
              </h1>
              <p className="text-slate-200 font-medium">{activity.period}</p>
              <p className="text-sm text-slate-400">
                {activity.values.timePlayedSeconds.basic.displayValue}
              </p>
            </div>
          </div>
          <div className="p-8">
            {activity.values.standing ? (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg text-white font-bold uppercase tracking-widest">
                    Match results
                  </h1>
                  <span className="text-sm text-slate-300">/ /</span>

                  <span
                    className={cn(
                      "text-sm font-bold uppercase",
                      activity.values.standing.basic.displayValue === "Victory"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {activity.values.standing.basic.displayValue}
                  </span>
                </div>

                <div className="pt-4">
                  <h1 className="text-lg text-white font-bold uppercase tracking-widest">
                    Your Team
                  </h1>
                </div>

                <div className="pt-4">
                  <h1 className="text-lg text-white font-bold uppercase tracking-widest">
                    Opponents
                  </h1>
                </div>
              </div>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

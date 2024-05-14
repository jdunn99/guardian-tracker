"use client";

import { useManifest } from "@/lib/manifest/useManifest";
import { Milestone } from "./milestone-container";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import Image from "next/image";
import {
  DestinyTooltip,
  TooltipBody,
  TooltipDescription,
  TooltipHeader,
  TooltipTitle,
} from "@/components/ui/tooltip";
import { DestinyQuestStatus } from "bungie-api-ts/destiny2";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface MilestoneQuestProps {
  milestone: Milestone;
  status?: DestinyQuestStatus;
}

export function MilestoneQuestItem({ milestone, status }: MilestoneQuestProps) {
  const manifest = useManifest();

  const questSteps = React.useMemo(() => {
    if (!manifest || !status) {
      return null;
    }

    const results = [];
    for (const step of status.stepObjectives) {
      const destinyObjective =
        manifest.DestinyObjectiveDefinition[step.objectiveHash];

      results.push({
        step,
        destinyObjective,
      });
    }

    return results;
  }, [manifest, status]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Image
          className="bg-slate-800/50  border-slate-700 border p-1"
          width={48}
          height={48}
          src={`https://bungie.net${milestone.icon}`}
          alt=""
        />
      </HoverCardTrigger>
      <DestinyTooltip>
        <TooltipHeader>
          <TooltipTitle>{milestone.name}</TooltipTitle>
        </TooltipHeader>
        <TooltipBody>
          <p className="text-sm text-slate-300">{milestone.description}</p>

          {questSteps ? (
            <div className="space-y-2 pt-4">
              {questSteps.map(({ step, destinyObjective }) => (
                <div
                  key={destinyObjective.hash}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    disabled
                    className="disabled:cursor-context-menu bg-slate-800/50 rounded-none w-5 h-5 border border-slate-700/50"
                  />
                  <div className="relative flex-1 w-full bg-slate-800/50 h-5 ">
                    <div
                      className="absolute inset-y-0 bg-green-200 h-full -z-10"
                      style={{
                        width: `${((step.progress || 0) / step.completionValue) * 100}%`,
                      }}
                    />
                    <div className="z-50 flex justify-between w-full items-center pt-0.5 px-2 text-white text-xs">
                      <p className="truncate">
                        {destinyObjective.progressDescription}
                      </p>
                      <p className="pl-16">
                        {step.progress || 0} / {step.completionValue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </TooltipBody>
      </DestinyTooltip>
    </HoverCard>
  );
}

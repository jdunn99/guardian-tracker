"use client";

import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
} from "@/components/ui/tooltip";
import { useManifest } from "@/lib/manifest/useManifest";
import { cn } from "@/lib/utils";
import { HoverCard } from "@radix-ui/react-hover-card";
import { DestinyManifest } from "bungie-api-ts/destiny2";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartCustomTooltipProps {
  secondLabel: string;
  manifest?: ReturnType<typeof useManifest>;
}

export function ChartCustomTooltip({
  active,
  payload,
  label,
  secondLabel,
  manifest,
}: TooltipProps<ValueType, NameType> & ChartCustomTooltipProps) {
  if (active && payload && payload.length) {
    const [item] = payload;

    const keys = item.dataKey!.toString().split(".");
    let renderValue = "";

    if (keys.length === 4) {
      renderValue = item.payload[keys[0]][keys[1]][keys[2]][keys[3]];
    } else {
      renderValue = item.payload[item.dataKey as keyof typeof item.payload];
    }

    let title = "";
    if (manifest) {
      title =
        manifest.DestinyActivityDefinition[
          item.payload.activityDetails.directorActivityHash
        ].displayProperties.name;
    }

    return (
      // <HoverCard>
      //   <DestinyTooltip>
      //     <TooltipHeader>
      //       <TooltipTitle>{item.name}</TooltipTitle>
      //     </TooltipHeader>
      //   </DestinyTooltip>
      // </HoverCard>
      <div className="p-2 bg-slate-700/50 backdrop-blur-sm">
        {title !== "" ? (
          <h3 className="text-white font-bold">{title}</h3>
        ) : null}
        <p
          className={cn(
            title === ""
              ? "text-white font-bold"
              : "text-slate-200 text-sm font-semibold"
          )}
        >
          {item.payload.period
            ? new Date(item.payload.period).toLocaleString()
            : label}
        </p>
        <p className="text-xs text-slate-300">
          <span className="capitalize">{secondLabel}: </span>
          {/* {item.payload[item.dataKey as keyof typeof item.payload]} */}
          {renderValue.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
}

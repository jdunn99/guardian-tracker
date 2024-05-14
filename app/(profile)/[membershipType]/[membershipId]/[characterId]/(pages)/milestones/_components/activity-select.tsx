"use client";

import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  DestinyTooltip,
  TooltipHeader,
  TooltipTitle,
  TooltipBody,
  TooltipDescription,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type } from "os";

interface ActivitySelectProps {
  onClick(): void;
  image: string;
  value: string;
  description: string;
  isSelected: boolean;
}

export function ActivitySelect({
  onClick,
  value,
  description,
  image,
  isSelected,
}: ActivitySelectProps) {
  return (
    <li
      className="p-0.5 transition-all border border-transparent hover:border-slate-700"
      onClick={onClick}
    >
      <HoverCard openDelay={300} closeDelay={300}>
        <HoverCardTrigger asChild>
          <Image
            src={image}
            alt=""
            width={48}
            height={48}
            className={cn(
              "border p-1  hover:bg-slate-700/50 text-slate-300",
              isSelected
                ? "bg-slate-700/50 border-yellow-500/40"
                : "bg-slate-800/50 border-slate-700"
            )}
          />
        </HoverCardTrigger>
        <DestinyTooltip>
          <TooltipHeader className="bg-slate-700/30">
            <TooltipTitle>{value}</TooltipTitle>
          </TooltipHeader>
          <TooltipBody>
            <TooltipDescription>{description}</TooltipDescription>
          </TooltipBody>
        </DestinyTooltip>
      </HoverCard>
    </li>
  );
}

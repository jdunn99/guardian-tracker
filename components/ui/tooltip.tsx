"use client";
import { cn } from "@/lib/utils";
import { HoverCardContent } from "./hover-card";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TooltipHeader({ children, className }: TooltipProps) {
  return (
    <div className={cn("p-2 space-y-1 bg-purple-500/60", className)}>
      {children}
    </div>
  );
}

export function TooltipTitle({ children }: TooltipProps) {
  return (
    <h1 className="uppercase text-white font-medium text-xl">{children}</h1>
  );
}

export function TooltipDescription({ children }: TooltipProps) {
  return <h3 className=" text-lg text-slate-300">{children}</h3>;
}

export function TooltipBody({ children, className, ...rest }: TooltipProps) {
  return (
    <div className={cn("p-2 text-white", className)} {...rest}>
      {children}
    </div>
  );
}

export function DestinyTooltip({ children }: TooltipProps) {
  return (
    <HoverCardContent
      className="bg-slate-800/90 rounded-none border-0 p-0 backdrop-blur"
      dir="left"
    >
      {children}
    </HoverCardContent>
  );
}

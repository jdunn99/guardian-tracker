"use client";
import { cn } from "@/lib/utils";
import { HoverCardContent } from "./hover-card";
import Image from "next/image";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TooltipHeader({ children, className, style }: TooltipProps) {
  return (
    <div className={cn("p-2 ", className)} style={style}>
      {children}
    </div>
  );
}

export function TooltipTitle({ children }: TooltipProps) {
  return (
    <h1 className=" text-slate-100 font-medium text-2xl uppercase">
      {children}
    </h1>
  );
}

export function TooltipDescription({ children }: TooltipProps) {
  return (
    <h3 className="text-slate-300 inline-flex w-full justify-between items-center">
      {children}
    </h3>
  );
}

export function TooltipImage({ src }: { src: string }) {
  return (
    <Image
      src={`https://bungie.net${src}`}
      width={1280}
      height={720}
      className="w-full h-auto"
      alt="img"
    />
  );
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
      className="bg-slate-900/60 rounded-none border-0 p-0 backdrop-blur w-96"
      dir="left"
    >
      {children}
    </HoverCardContent>
  );
}

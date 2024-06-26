"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { ScrollArea } from "./scroll-area";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "group break-words relative w-full p-4  border-slate-700/65 rounded-lg border bg-gradient-to-br from-slate-800 to bg-slate-800/25 hover:border-slate-700 transition-colors ",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ScrollCard({ children, className }: CardProps) {
  return (
    <ScrollArea className={cn("h-[75vh]", className)}>{children}</ScrollArea>
  );
}

interface ImageCardProps extends CardProps {
  image: string;
}
export function ImageCard({ children, image }: ImageCardProps) {
  return (
    <div className="cursor-pointer group relative w-full overflow-hidden hover:border-yellow-500/30 border-slate-700/65 rounded-xl border bg-gradient-to-br from-slate-900 to-transparent hover:to-yellow-500/70 transition-colors ">
      <div className={cn("relative min-h-[300px] p-4 h-full", image)}>
        {/* <div
          className={cn(
            "absolute bg-gradient-to-b z-0 to-slate-900 w-full inset-y-0 inset-x-0 ",
            hovered
              ? "from-slate-900/70 to-yellow-500/50"
              : "from-slate-900/70 to-slate-900"
          )}
        /> */}
        <div className="flex h-full flex-col justify-end z-50 text-white font-bold text-xl relative">
          {children}
        </div>
      </div>
    </div>
  );
}

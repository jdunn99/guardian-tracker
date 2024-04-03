"use client";
import Image from "next/image";

interface IconProps {
  value: string;
  src: string;
}
export function Icon({ value, src }: IconProps) {
  return (
    <div className="flex items-center gap-1">
      <Image width={32} height={32} alt={value} src={src} className="w-4 h-4" />
      <span className="text-xs text-slate-400">{value}</span>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();

  return (
    <Link href={href}>
      <div
        className={cn("hover:text-white text-slate-300 transition-colors", {
          "!text-yellow-500": pathname === href,
        })}
      >
        {title}
      </div>
    </Link>
  );
}

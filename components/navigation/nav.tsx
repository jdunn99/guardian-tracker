import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./nav-link";
import { SearchBar } from "../search";

export function Nav() {
  return (
    <header className="w-full  z-50">
      <div className="container h-14 flex items-center text-sm font-medium">
        <div className="flex w-full items-center justify-between">
          <div className="relative flex items-center gap-3">
            <Link
              href="/"
              className="flex space-x-2 text-white focus:outline-none focus-visible:ring-2 mr-6"
            >
              <Image src="/ghost.svg" width={32} height={32} alt="logo" />
              <div className="-space-y-1">
                <p className="font-bold">Guardian</p>
                <p className="font-bold">Tracker</p>
              </div>
            </Link>

            <NavLink href="/builds" title="Builds" />
            <NavLink href="/weapons" title="Weapons" />
          </div>
        </div>
        <div className="w-96">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

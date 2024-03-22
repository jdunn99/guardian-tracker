"use client";

import { SearchBar } from "./search";

export function Nav() {
  return (
    <header className="w-full h-14 bg-white border-b">
      <nav className="h-full flex items-center">
        <ul className="">
          <li>
            <SearchBar />
          </li>
        </ul>
      </nav>
    </header>
  );
}

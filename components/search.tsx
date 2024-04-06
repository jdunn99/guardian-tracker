"use client";
import { $http, PlatformIcons } from "@/lib/bungie";
import {
  UserSearchResponse,
  UserSearchResponseDetail,
  searchByGlobalNamePost,
} from "bungie-api-ts/user";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { ScrollAreaThumb } from "@radix-ui/react-scroll-area";
import { Input } from "./ui/input";
import Link from "next/link";

interface SearchResultsProps {
  query: string;
}

function SearchResults({ query }: SearchResultsProps) {
  const [data, setData] = React.useState<UserSearchResponse>();

  React.useEffect(() => {
    async function fetchData() {
      const results = await searchByGlobalNamePost(
        $http,
        {
          page: 0,
        },
        {
          displayNamePrefix: query,
        }
      );

      setData(results.Response);
    }

    fetchData();
  }, [query]);

  return typeof data !== "undefined" && query !== "" ? (
    <ScrollArea className="!absolute bg-slate-800 text-secondary border-slate-700 border z-50 top-11 w-full rounded-lg shadow  break-words">
      <div className="w-full space-y-1 max-h-[128px]">
        <p className="text-xs px-4 pt-2 text-yellow-500 font-semibold">
          Results
        </p>
        {data.searchResults.map((result) =>
          result.destinyMemberships[0] ? (
            <Link
              key={crypto.randomUUID()}
              className="w-full block cursor-pointer hover:bg-slate-900 px-4 py-2"
              href={`/${result.destinyMemberships[0].membershipType}/${result.destinyMemberships[0].membershipId}`}
            >
              <div
                key={crypto.randomUUID()}
                className="flex items-center gap-2 text-sm"
              >
                <p>{result.bungieGlobalDisplayName}</p>
                <p className="text-xs text-yellow-500 bg-slate-900 py-0.5 rounded font-semibold px-1">
                  # {result.bungieGlobalDisplayNameCode}
                </p>
                {result.destinyMemberships.map((membership) =>
                  membership.applicableMembershipTypes.map(
                    (membershipType) =>
                      PlatformIcons[
                        membershipType as keyof typeof PlatformIcons
                      ]
                  )
                )}
              </div>
            </Link>
          ) : null
        )}
      </div>
    </ScrollArea>
  ) : null;
}

export function SearchBar() {
  const [query, setQuery] = React.useState<string>("");

  return (
    <div className="relative max-w-md">
      <Input
        type="search"
        className="bg-slate-900 border-slate-700 text-secondary w-full focus:bg-slate-900 focus-visible:outline-none"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Guardians"
      />
      <SearchResults query={query} />
    </div>
  );
}

"use client";
import { $http, PlatformIcons } from "@/lib/bungie";
import { searchByGlobalNamePost } from "bungie-api-ts/user";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import Link from "next/link";
import { getProfile } from "bungie-api-ts/destiny2";
import useSWR from "swr";
import Image from "next/image";

interface SearchResultsProps {
  query: string;
}

async function getSearchResults(query: string) {
  const results = await searchByGlobalNamePost(
    $http,
    { page: 0 },
    { displayNamePrefix: query }
  );

  if (!results.Response) {
    throw new Error("Something went wrong fetching the results");
  }

  const { searchResults } = results.Response;

  const parsedResult = await Promise.all(
    searchResults.map(async (result) => {
      try {
        if (!result.destinyMemberships) {
          return null;
        }

        const { membershipId, membershipType } = result.destinyMemberships[0];

        const profile = await getProfile($http, {
          membershipType,
          destinyMembershipId: membershipId,
          components: [100, 200],
        });

        // Not found
        if (profile.ErrorCode === 1601) {
          return null;
        }

        const character = Object.values(profile.Response.characters.data!)[0];
        if (!character) {
          throw new Error("Error fetching the character");
        }

        const emblem = character.emblemPath;
        const dateLastPlayed = profile.Response.profile.data!.dateLastPlayed;

        return {
          ...result,
          emblem,
          dateLastPlayed,
        };
      } catch (error) {
        return null;
      }
    })
  );

  return parsedResult;
}

function SearchResults({ query }: SearchResultsProps) {
  const { data } = useSWR(query, () => getSearchResults(query));

  return typeof data !== "undefined" && query !== "" ? (
    <ScrollArea className="!absolute bg-slate-800 text-secondary border-slate-700 border z-[99] top-11 w-full rounded-lg shadow  break-words">
      <div className="w-full space-y-1 max-h-[200px]">
        <p className="text-xs px-4 pt-2 text-yellow-500 font-semibold">
          Results
        </p>
        {data.map((result) =>
          result !== null ? (
            <Link
              key={crypto.randomUUID()}
              className="w-full block cursor-pointer hover:bg-slate-900 px-4 py-2"
              href={`/${result.destinyMemberships[0].membershipType}/${result.destinyMemberships[0].membershipId}`}
            >
              <div
                key={crypto.randomUUID()}
                className="flex items-center gap-2 text-sm"
              >
                <Image
                  src={`https://bungie.net${result.emblem}`}
                  width={32}
                  className="border border-slate-700"
                  height={32}
                  alt=""
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p>{result.bungieGlobalDisplayName}</p>
                    <p className="text-[10px] text-yellow-500 font-semibold ">
                      #{result.bungieGlobalDisplayNameCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">
                      Last seen {new Date(result.dateLastPlayed).toDateString()}
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
                </div>
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
        className="bg-slate-950/50 border-slate-700 text-sm text-white w-full h-9 focus:bg-slate-950 focus-visible:outline-none"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Guardians"
      />
      <SearchResults query={query} />
    </div>
  );
}

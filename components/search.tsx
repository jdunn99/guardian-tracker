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

  function onClick(result: UserSearchResponseDetail) {
    const { destinyMemberships } = result;
    console.log(
      result.bungieNetMembershipId,
      destinyMemberships[0].membershipId
    );
  }

  return typeof data !== "undefined" && query !== "" ? (
    <ScrollArea className="!absolute bg-background z-50 top-8 w-full rounded-lg shadow  break-words">
      <div className="w-full space-y-1 max-h-[128px]">
        {data.searchResults.map((result) => (
          <div
            key={crypto.randomUUID()}
            className="w-full cursor-pointer hover:bg-secondary"
            onClick={() => onClick(result)}
          >
            <div
              key={crypto.randomUUID()}
              className="flex items-center gap-2 text-sm"
            >
              <p>{result.bungieGlobalDisplayName}</p>
              <p># {result.bungieGlobalDisplayNameCode}</p>
              {result.destinyMemberships.map((membership) =>
                membership.applicableMembershipTypes.map(
                  (membershipType) =>
                    PlatformIcons[membershipType as keyof typeof PlatformIcons]
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ) : null;
}

export function SearchBar() {
  const [query, setQuery] = React.useState<string>("");

  return (
    <div className="relative">
      <input type="search" onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={query} />
    </div>
  );
}

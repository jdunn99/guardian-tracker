"use client";

interface TriumphTitleProps {
  characterPresentationNodes: Record<number, DestinyPresentationNodeComponent>;
}

import { Card } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/hover-card";
import { getCommonSettings } from "@/lib/manifest/actions";
import { useManifest } from "@/lib/manifest/useManifest";
import { HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  DestinyPresentationNodeComponent,
  DestinyPresentationNodeDefinition,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import React from "react";
import useSWR from "swr";

export const NOSEAL =
  "https://www.bungie.net/7/ca/destiny/icons/profile/noseal.png";

export function TriumphTitles({
  characterPresentationNodes,
}: TriumphTitleProps) {
  const { data } = useSWR("common-settings", getCommonSettings);
  const manifest = useManifest();

  const characterTitles = React.useMemo(() => {
    const result: (DestinyPresentationNodeDefinition | null)[] = [];
    if (!data || !manifest) {
      return null;
    }

    const triumphRootNode = data.destiny2CoreSettings.activeSealsRootNodeHash;
    const titles =
      manifest.DestinyPresentationNodeDefinition[triumphRootNode].children
        .presentationNodes;

    for (const title of titles) {
      const node = characterPresentationNodes[title.presentationNodeHash];

      if (node && node.completionValue === node.progressValue) {
        result.push(
          manifest.DestinyPresentationNodeDefinition[title.presentationNodeHash]
        );
      }

      if (result.length === 6) {
        return result;
      }
    }

    // fill the rest of the result since we only want to show 6
    for (let i = result.length; i < 6; ++i) {
      result.push(null);
    }

    return result;
  }, [data, manifest, characterPresentationNodes]);

  if (!characterTitles) {
    return null;
  }

  return (
    <Card>
      <h5 className="text-xs uppercase text-yellow-500 font-bold">Triumphs</h5>
      <div className="grid grid-cols-6 gap-1 mt-2">
        {characterTitles.map((title) =>
          title !== null ? (
            <HoverCard key={title.hash}>
              <HoverCardTrigger>
                <Image
                  src={`https://bungie.net${title.displayProperties.icon}`}
                  width={48}
                  height={48}
                  alt={title.displayProperties.name}
                  key={title.hash}
                />
              </HoverCardTrigger>
              <HoverCardContent className="bg-slate-800 p-4 z-50">
                <p className="text-sm text-white">
                  {title.displayProperties.name}
                </p>
                <span className="text-slate-400 text-xs italic">
                  {title.displayProperties.description}
                </span>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Image
              src="https://www.bungie.net/7/ca/destiny/icons/profile/noseal.png"
              width={48}
              height={48}
              key={crypto.randomUUID()}
              alt="No-title"
            />
          )
        )}
      </div>
    </Card>
  );
}

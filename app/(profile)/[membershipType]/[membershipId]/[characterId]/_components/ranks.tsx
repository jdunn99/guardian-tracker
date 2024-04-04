import { getManifest } from "@/lib/bungie";
import {
  DestinyCharacterComponent,
  DestinyCharacterProgressionComponent,
  DestinyProgression,
  DestinyProgressionDefinition,
} from "bungie-api-ts/destiny2";
import Image from "next/image";

const HASHES = [
  457612306, 2083746873, 3696598664, 599071390, 2755675426, 3008065600,
];

const HASH_TO_ICON = {
  457612306: "/vanguard.svg",
  2083746873: "/crucible.svg",
  3696598664: "/competitive.svg",
  599071390: "/iron-banner.svg",
  2755675426: "/trials.svg",
  3008065600: "/gambit.svg",
};

function parseProgression(progression: Record<number, DestinyProgression>) {
  const result: DestinyProgression[] = [];

  for (const hash of HASHES) {
    result.push(progression[hash]);
  }

  return result;
}

export async function Ranks(character: DestinyCharacterProgressionComponent) {
  const manifest = await getManifest(["DestinyProgressionDefinition"]);
  const ranks = parseProgression(character.progressions);

  return (
    <div className="flex items-start gap-6">
      {ranks.map((rank) => {
        const progression =
          manifest.DestinyProgressionDefinition[rank.progressionHash];

        return (
          <div
            className="flex flex-col justify-center items-center gap-2"
            key={rank.progressionHash}
          >
            <Image
              src={
                HASH_TO_ICON[
                  rank.progressionHash as unknown as keyof typeof HASH_TO_ICON
                ]
              }
              className="w-6 h-6 opacity-90"
              width={32}
              height={32}
              alt={rank.progressionHash.toString()}
            />
            <div className="flex items-center text-xs  text-slate-100">
              <Image
                src={`https://bungie.net${progression.steps[rank.level].icon}`}
                alt={rank.level.toString()}
                className="w-4 h-4"
                width={24}
                height={24}
              />
              {rank.currentProgress}
            </div>
          </div>
        );
      })}
    </div>
  );
}

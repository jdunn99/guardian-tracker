import {
  DestinyCharacterComponent,
  DestinyManifestSlice,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { Container } from "./container";
import { $http, Manifest, getManifest } from "@/lib/bungie";

interface CharacterEmblemProps extends DestinyCharacterComponent {
  manifest: Manifest;
}

function CharacterEmblem({ manifest, ...character }: CharacterEmblemProps) {
  return (
    <div>
      <div
        className="h-16 bg-no-repeat bg-contain flex pt-1 pl-14 pr-2"
        style={{
          backgroundImage: `url(https://bungie.net${character.emblemBackgroundPath})`,
        }}
      >
        <div className="flex w-full justify-between ">
          <div>
            <p className="font-semibold">
              {
                manifest.DestinyClassDefinition[character.classHash]
                  .displayProperties.name
              }
            </p>

            <p className="text-xs text-slate-300">
              {
                manifest.DestinyRaceDefinition[character.raceHash]
                  .displayProperties.name
              }
            </p>
          </div>
          <h1 className="text-xl text-yellow-300 font-bold">
            &E052; {character.light}
          </h1>
        </div>
      </div>
    </div>
  );
}

export async function CharacterEmblems(
  data: Record<string, DestinyCharacterComponent>
) {
  const characterIds = Object.keys(data);
  const manifest = await getManifest();

  return (
    <Container heading="Characters">
      <div className=" grid">
        {characterIds.map((id) => (
          <CharacterEmblem {...data[id]} key={id} manifest={manifest} />
        ))}
      </div>
    </Container>
  );
}

import {
  AllDestinyManifestComponents,
  GetDestinyManifestSliceParams,
  HttpClientConfig,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { HttpQueryParams } from "bungie-api-ts/http";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { SiStadia } from "react-icons/si";

export const PlatformIcons = {
  1: <FaXbox key="Xbox" />,
  2: <FaPlaystation key="PS" />,
  3: <FaSteam key="Steam" />,
  5: <SiStadia key="Stadia" />,
};

/**
 * Parses HTTP params from the bungie-api-ts library to make fetch requests
 */
function parseParams(params: HttpQueryParams) {
  let parsedParams = "?";
  const keys = Object.keys(params);

  for (let i = 0; i < keys.length; ++i) {
    if (i > 0) {
      parsedParams += "&";
    }

    parsedParams += keys[i] + "=" + params[keys[i]];
  }

  return parsedParams;
}

/**
 * Basic config from bungie-api-ts
 */
export async function $http<Return>(config: HttpClientConfig): Promise<Return> {
  const { url, params, method, body } = config;
  const parsedUrl =
    url + (typeof params !== "undefined" ? parseParams(params!) : "");

  // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
  const result = await fetch(parsedUrl, {
    headers: {
      "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY!,
      "Content-type": "application/json",
      accept: "application/json",
    },
    cache: "no-cache",
    method,
    body: JSON.stringify(body),
  });

  const json = await result.json();

  return json;
}

/**
 * Since RSC's and NextJS fetch have caching built-in, we can just call this function
 * everytime we need the manifest and not worry about storing in a global store.
 * Maybe should just pass tableNames as an argument but that would mean we would
 * have cache differences and what not.
 *
 * ISSUE: The inventory manifest is too large to cache. So for now, I will manually fetch and save it to a JSON file.
 */
export async function getManifest() {
  const manifestResponse = await getDestinyManifest($http);

  if (typeof manifestResponse.Response === "undefined") {
    throw new Error("Something went wrong fetching the manifest");
  }

  const manifest = await getDestinyManifestSlice($http, {
    destinyManifest: manifestResponse.Response,
    language: "en",
    tableNames: [
      "DestinyClassDefinition",
      "DestinyRaceDefinition",
      "DestinyInventoryBucketDefinition",
      "DestinySandboxPerkDefinition",
      "DestinySocketCategoryDefinition",
      "DestinySandboxPerkDefinition",
      "DestinyMilestoneDefinition",
      "DestinyObjectiveDefinition",
      "DestinyActivityDefinition",
      "DestinyActivityModifierDefinition",
    ],
  });

  return manifest;
}

export async function getManifest2<
  T extends (keyof AllDestinyManifestComponents)[]
>(tableNames: T) {
  const manifest = await getDestinyManifest($http);

  if (typeof manifest.Response === "undefined") {
    throw new Error("Something went wrong fetching the manifest");
  }

  console.log(tableNames);

  return await getDestinyManifestSlice($http, {
    destinyManifest: manifest.Response,
    language: "en",
    tableNames,
  });
}

// If I ever need to use Manifest in props, I can just call this type
export type Manifest = Awaited<ReturnType<typeof getManifest>>;

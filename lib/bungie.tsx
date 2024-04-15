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

export type DamageType = "Arc" | "Solar" | "Void" | "Strand" | "Stasis";
export type ArmorType = "Arms" | "Helmet" | "Chest" | "Legs";

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
 * Used to make authorized HTTP requests with bungie-api-ts functions to the Bungie.net API endpoints
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
      Accept: "application/json",
    },
    method,
    body: JSON.stringify(body),
  });

  const json = await result.json();

  return json;
}

/**
 * Calls the Bungie API to retrieve the JSON from the requested manifest.
 * @param tableNames - The valid Bungie API manifest table names
 * @returns - The requested table names
 */
export async function getManifest<
  T extends (keyof AllDestinyManifestComponents)[],
>(tableNames: T) {
  const manifest = await getDestinyManifest($http);

  if (typeof manifest.Response === "undefined") {
    throw new Error("Something went wrong fetching the manifest");
  }

  return await getDestinyManifestSlice($http, {
    destinyManifest: manifest.Response,
    language: "en",
    tableNames,
  });
}

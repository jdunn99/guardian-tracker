import { HttpClientConfig } from "bungie-api-ts/destiny2";
import { HttpQueryParams } from "bungie-api-ts/http";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { SiStadia } from "react-icons/si";

export const PlatformIcons = {
  1: <FaXbox />,
  2: <FaPlaystation />,
  3: <FaSteam />,
  5: <SiStadia />,
};

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

export async function $http<Return>(config: HttpClientConfig): Promise<Return> {
  console.log(config);

  const { url, params, method, body } = config;
  const parsedUrl =
    url + (typeof params !== "undefined" ? parseParams(params!) : "");

  // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
  const result = await fetch(parsedUrl, {
    headers: {
      "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    method,
    body: JSON.stringify(body),
  });

  const json = await result.json();

  return json;
}

import { BungieClient } from ".";

declare global {
  var cachedClient: BungieClient;
}

let bungieClient: BungieClient;
// if (process.env.NODE_ENV === "production") {
//   bungieClient = new BungieClient();
// } else {
//   if (!global.cachedClient) {
//     global.cachedClient = new BungieClient();
//   }
//   bungieClient = global.cachedClient;
// }
bungieClient = new BungieClient();

export default bungieClient;

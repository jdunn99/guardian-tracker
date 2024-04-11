import { $http } from "@/lib/bungie";
import { getItem } from "bungie-api-ts/destiny2";
import { headers } from "next/headers";
import { Subclass } from "./subclass";

interface CharacterSubclassProps {
  itemInstanceId: string;
  membershipType: number;
  membershipId: string;
}
export async function CharacterSubclass({
  itemInstanceId,
  membershipId,
  membershipType,
}: CharacterSubclassProps) {
  const result = await getItem($http, {
    components: [305, 307],
    destinyMembershipId: membershipId,
    membershipType,
    itemInstanceId,
  });

  if (!result.Response) {
    throw new Error("Something went wrong fetching the Subclass");
  }

  const data = result.Response;
  const subclassHash = data.item.data!.itemHash;
  const sockets = data.sockets.data!.sockets;

  // TODO: Suspense
  return <Subclass subclassHash={subclassHash} sockets={sockets} />;
}

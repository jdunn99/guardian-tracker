import { $http } from "@/lib/bungie";
import { DestinyComponentType, getProfile } from "bungie-api-ts/destiny2";
import React from "react";
import { Profile } from "./_components/profile";
import { getGroupsForMember } from "bungie-api-ts/groupv2";
import { Clan } from "./_components/clan";
import { Characters } from "./_components/characters";
import { Nav } from "@/components/navigation/nav";

interface Props {
  params: {
    membershipId: string;
    membershipType: string;
  };
}

// 100,102,103,104,200,201,202,204,205,206,300,301,302,303,304,
// 305,306,307,308,309,310,700,800,900,1000,1100,1200,1400
export async function getDestinyProfile(
  membershipType: number,
  membershipId: string
) {
  const { Response: data, ErrorStatus } = await getProfile($http, {
    destinyMembershipId: membershipId,
    components: [
      100, 104, 200, 202, 204, 205, 300, 301, 302, 303, 304, 305, 306, 307, 308,
      310, 900, 1100, 1200,
    ],
    membershipType,
  });

  console.log(data, ErrorStatus);

  if (!data) {
    throw new Error("Something went wrong fetching the User's profile");
  }

  return data;
}

async function getUserClan(membershipType: number, membershipId: string) {
  const { Response: data } = await getGroupsForMember($http, {
    filter: 0,
    groupType: 1,
    membershipId,
    membershipType,
  });

  if (!data) {
    throw new Error("Something went wrong fetching the groups for a User.");
  }

  return data;
}

export default async function Page({ params }: Props) {
  const { membershipId, membershipType } = params;
  const type = parseInt(membershipType);

  const data = await getDestinyProfile(type, membershipId);
  const clanData = await getUserClan(type, membershipId);
  clanData.results[0]?.group;

  const { characters, profile } = data;

  if (!profile.data) {
    throw new Error("Something went wrong fetching the profile");
  }

  if (!characters.data) {
    throw new Error(
      "Something went wrong fetching the characters of the profile"
    );
  }

  return (
    <React.Fragment>
      <section className="container text-white break-words pt-36 h-full space-y-4 ">
        <Profile {...profile.data} />
        {clanData.results && clanData.results[0] ? (
          <Clan {...clanData.results[0].group} />
        ) : null}
        <Characters {...characters.data} />
      </section>
    </React.Fragment>
  );
}

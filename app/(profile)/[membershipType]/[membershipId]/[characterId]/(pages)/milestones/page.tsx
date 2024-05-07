import { getProfile, getPublicMilestones } from "bungie-api-ts/destiny2";
import { Props } from "../../page";
import { $http } from "@/lib/bungie";
import { Milestones } from "./_components/milestone-container";

async function getExoticReward() {}

export default async function CharacterMilestonePage({ params }: Props) {
  const { membershipId, membershipType, characterId } = params;

  // Challenges
  // Activities
  // Quests

  // Just temporary until I rework the data fetching
  const result = await getProfile($http, {
    destinyMembershipId: membershipId,
    membershipType: parseInt(membershipType),
    components: [202, 204],
  });

  const test: any = await getPublicMilestones($http);

  if (!result.Response) {
    throw new Error("Something went wrong fetching the results");
  }

  const { characterProgressions } = result.Response;
  const milestones = characterProgressions.data![characterId].milestones;

  return (
    <Milestones milestones={milestones} publicMilestones={test.Response} />
  );
}

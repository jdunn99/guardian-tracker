import { HoverItem } from "@/components/hover-item";
import { $http, getManifest2 } from "@/lib/bungie";
import { getPublicMilestones } from "bungie-api-ts/destiny2";

const TRIALS_HASH = 3007559996;
const IRON_BANNER_HASH = 3427325023;
const WEEKLY_PVP_CHALLENGE_HASH = 1506285920;

const PVP_IMAGE_HASHES = {
  3007559996: "Trials of Osiris",
  3427325023: "Iron Banner",
  1506285920: "Crucible",
};

const IMAGE_HASHES = {
  Trials:
    "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_e35792b49b249ca5dcdb1e7657ca42b6.png",
  IB: "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fe57052d7cf971f7502daa75a2ca2437.png",
  Crucible:
    "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fb3e9149c43f7a2e8f8b66cbea7845fe.png",
};

export async function WeeklyPVPMilestones() {
  const milestones = await getPublicMilestones($http);
  const { Response: data } = milestones;

  if (!data) {
    throw new Error("Error fetching milestones");
  }

  const trials = data[TRIALS_HASH];
  const ironBanner = data[IRON_BANNER_HASH];
  const weeklyPvpChallenge = data[WEEKLY_PVP_CHALLENGE_HASH];

  const { DestinyActivityDefinition, DestinyActivityModifierDefinition } =
    await getManifest2([
      "DestinyActivityDefinition",
      "DestinyActivityModifierDefinition",
    ]);

  return (
    <div className="space-y-2 mt-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img src={IMAGE_HASHES.Trials} className="w-8 h-8" />
          <h1 className="text-white text-sm font-semibold">Trials of Osiris</h1>
          {typeof trials.activities !== "undefined" ? null : (
            <span className="text-red-500 text-xs font-bold">Inactive</span>
          )}
        </div>

        {typeof trials.activities !== "undefined" ? (
          <div className="flex gap-2 items-center">
            {DestinyActivityDefinition[trials.activities[0].activityHash].hash}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img src={IMAGE_HASHES.IB} className="w-8 h-8" />
          <h1 className="text-white text-sm font-semibold">Iron Banner</h1>

          {typeof ironBanner !== "undefined" ? null : (
            <span className="text-red-500 text-xs font-bold">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <img src={IMAGE_HASHES.Crucible} className="w-8 h-8" />
        <div className="space-y-2">
          <h1 className="text-white text-sm font-semibold">
            Weekly Crucible Activity
          </h1>
          <div className="flex gap-2 items-center">
            <HoverItem
              {...DestinyActivityDefinition[
                weeklyPvpChallenge.activities[0].activityHash
              ].displayProperties}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

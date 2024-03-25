import { CharacterEmblems } from "@/components/character-emblem";
import { Container } from "@/components/container";
import { DestinyLoadout } from "@/components/loadout";
import { Perk } from "@/components/perk";
import { ProfileHeader } from "@/components/profile-header";
import { $http, PlatformIcons, getManifest } from "@/lib/bungie";
import { DestinyComponentType, getProfile } from "bungie-api-ts/destiny2";

export default async function Home() {
  const result = await getProfile($http, {
    destinyMembershipId: "4611686018436921115",
    components: [
      DestinyComponentType.Profiles,
      DestinyComponentType.Characters,
      DestinyComponentType.CharacterEquipment,
      DestinyComponentType.ItemPerks,
    ],
    membershipType: 1,
  });

  const {
    Response: {
      profile: { data },
      characters: { data: characterData },
      characterEquipment: { data: equipmentData },
      itemComponents: {
        perks: { data: perks },
      },
    },
  } = result;

  const manifest = await getManifest();
  const perkDefs = manifest.DestinySandboxPerkDefinition;

  if (!data || !characterData || !equipmentData || !perks) {
    throw new Error("Failed to fetch");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full bg-slate-900 text-white">
      <div className="max-w-screen-lg mx-auto break-words w-full">
        <div className="relative space-y-8">
          <ProfileHeader {...data} />
          <div className="grid grid-cols-12">
            <div className="col-span-4 mr-2 space-y-2">
              <CharacterEmblems {...characterData} />

              <DestinyLoadout itemData={equipmentData} perkData={perks} />
            </div>
            <div className="col-span-8 ">
              <Container heading="Loadout"></Container>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

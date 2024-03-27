import { Countdown } from "@/components/countdown";
import { WeeklyNightfall } from "@/components/nightfall";
import { SearchBar } from "@/components/search";
import { $http } from "@/lib/bungie";
import { DestinyComponentType, getProfile } from "bungie-api-ts/destiny2";
import { WeeklyMilestones } from "./_components/milestones";
import { DailyLostSector } from "./_components/lost-sector";

export default async function Home() {
  // const result = await getProfile($http, {
  //   destinyMembershipId: "4611686018436921115",
  //   components: [
  //     DestinyComponentType.Profiles,
  //     DestinyComponentType.Characters,
  //     DestinyComponentType.CharacterEquipment,
  //     DestinyComponentType.ItemPerks,
  //   ],
  //   membershipType: 1,
  // });

  // const {
  //   Response: {
  //     profile: { data },
  //     characters: { data: characterData },
  //     characterEquipment: { data: equipmentData },
  //     itemComponents: {
  //       perks: { data: perks },
  //     },
  //   },
  // } = result;

  // if (!data || !characterData || !equipmentData || !perks) {
  //   throw new Error("Failed to fetch");
  // }

  return (
    <main className="min-h-screen  w-full bg-slate-900">
      {/* <div className="max-w-screen-lg mx-auto break-words w-full">
        <div className="relative space-y-8">
          <ProfileHeader
            {...data}
            image={`https://bungie.net${
              Object.values(characterData)[0].emblemPath
            } `}
          />
          <div className="grid grid-cols-12">
            <div className="col-span-4 mr-2 space-y-2">
              <CharacterEmblems {...characterData} />

              <DestinyLoadout itemData={equipmentData} perkData={perks} />
            </div>
            <div className="col-span-8 ">
              <Container heading="Recent Activity"></Container>
            </div>
          </div>
        </div>
      </div> */}
      <header className="w-full sm:py-64 py-16 pb-64 relative px-4">
        <div className="absolute inset-0 hero-gradient mx-auto max-w-[100vw] " />
        <div className="w-full mx-auto max-w-screen-md z-50 space-y-4 relative">
          <h1 className="text-5xl font-bold text-yellow-500 ">
            Guardian Tracker
          </h1>
          <p className="text-secondary max-w-md">
            An open source guardian helper for{" "}
            <span className="text-yellow-500">Destiny 2</span>
          </p>
          <SearchBar />
        </div>
        <div className="absolute -bottom-40 sm:-bottom-10 z-50 w-full flex justify-center inset-x-0">
          <div className="mx-auto max-w-screen-lg bg-slate-900 border p-4 rounded-lg border-slate-700 shadow-[0_4px_20px] shadow-yellow-500/20">
            <WeeklyMilestones />
          </div>
        </div>
      </header>
      <section className="pt-52 sm:py-32 pb-32 w-full">
        <div className="w-full max-w-screen-lg mx-auto space-y-8">
          <h1 className="text-center text-white text-2xl font-bold max-w-lg mx-auto">
            Track your stats. Create the perfect build. Optimize your time until
            reset.
          </h1>
          <div className="flex items-center justify-center text-xl text-slate-300 font-bold">
            <Countdown end="2024-04-02T17:00:00Z" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-screen-md mx-auto px-4">
            <div className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg ">
              <h1 className="text-lg font-semibold text-yellow-500">
                Nightfall this Week
              </h1>
              <WeeklyNightfall />
            </div>
            <div className="grid gap-2 grid-rows-2">
              <div className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg">
                <h1 className="text-lg font-semibold text-yellow-500">
                  Today&apos;s Lost Sector
                </h1>
                <DailyLostSector />
              </div>

              <div className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg">
                <p>Hi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

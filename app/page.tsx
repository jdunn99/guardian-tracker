import { Countdown } from "@/components/countdown";
import { WeeklyNightfall } from "@/components/nightfall";
import { SearchBar } from "@/components/search";
import { $http } from "@/lib/bungie";
import { DestinyComponentType, getProfile } from "bungie-api-ts/destiny2";
import { WeeklyMilestones } from "./_components/milestones";
import { DailyLostSector } from "./_components/lost-sector";
import { WeeklyPVPMilestones } from "./_components/pvp-milestones";
import { Card, ImageCard } from "@/components/ui/card";
import Image from "next/image";
import { Footer } from "@/components/navigation/footer";
import { Nav } from "@/components/navigation/nav";
import { Temp } from "./_components/temp";

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
      <Nav />
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
      <header className="w-full sm:pt-64 py-16 pb-48 relative px-4">
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
      </header>
      <section className="pt-16">
        <h1 className="w-full max-w-screen-xl text-white font-bold mx-auto mb-8 text-2xl">
          This Week in Destiny
        </h1>
        <WeeklyMilestones />
        <div className="grid gap-8 grid-cols-2 mx-auto max-w-screen-lg pt-16">
          <WeeklyNightfall />
          <DailyLostSector />
        </div>
      </section>
      {/* <section className="pt-52 sm:pt-32 pb-24 w-full">
        <div className="w-full max-w-screen-lg mx-auto space-y-8">
          <h1 className="text-center text-white text-2xl font-bold max-w-lg mx-auto">
            Track your stats. Create the perfect build. Optimize your time until
            reset.
          </h1>
          <div className="flex items-center justify-center text-xl text-slate-300 font-bold">
            <Countdown end="2024-04-09T17:00:00Z" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-screen-lg mx-auto px-4 ">
            <Card>
              <h1 className="text-lg font-semibold text-yellow-500">
                Nightfall this Week
              </h1>
              <WeeklyNightfall />
            </Card>
            <Card>
              <h1 className="text-lg font-semibold text-yellow-500">
                Today&apos;s Lost Sector
              </h1>
              <DailyLostSector />
            </Card>
          </div>
        </div>
      </section> */}

      <section className="py-16 pb-32 w-full relative">
        <div className="absolute w-3/4 left-0 radial-gradient h-3/4" />
        <div className="absolute w-1/2 right-0 radial-gradient h-3/4" />
        <div className="w-full max-w-screen-lg mx-auto space-y-8">
          <h1 className="text-center text-white text-2xl font-bold max-w-lg mx-auto">
            Explore popular builds for each class.
          </h1>
          <div className="grid sm:grid-cols-3 gap-4 w-full mx-auto px-4 z-50">
            <ImageCard image="hunter-bg">
              <div className="space-y-2">
                <Image src="/hunter.svg" height={32} width={32} alt="Hunter" />
                Hunter
              </div>
            </ImageCard>
            <ImageCard image="titan-bg">
              <div className="space-y-4">
                <Image src="/titan.svg" height={32} width={32} alt="Titan" />
                Titan
              </div>
            </ImageCard>
            <ImageCard image="warlock-bg">
              <div className="space-y-1">
                <Image
                  src="/warlock.svg"
                  height={32}
                  width={32}
                  alt="Warlock"
                />
                Warlock
              </div>
            </ImageCard>
          </div>
        </div>
      </section>

      <section className="py-16 pb-32 w-full relative">
        <div className="w-full max-w-screen-lg mx-auto space-y-8 text-white">
          <Temp />
        </div>
      </section>

      <Footer />
    </main>
  );
}

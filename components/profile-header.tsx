import { PlatformIcons } from "@/lib/bungie";
import { DestinyProfileComponent } from "bungie-api-ts/destiny2";

export function ProfileHeader(
  data: DestinyProfileComponent & { image: string }
) {
  return (
    <div className="flex gap-4 items-center">
      <img
        src={data.image}
        className="w-20 h-20 bg-slate-800 rounded-lg border-slate-700 border"
      />
      <div className="space-y-1">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">
            {data.userInfo.bungieGlobalDisplayName}
          </h1>
          <p className="text-xs font-semibold text-yellow-400 p-1 bg-slate-800 rounded border-slate-700 border">
            #{data.userInfo.bungieGlobalDisplayNameCode}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          {data.userInfo.applicableMembershipTypes.map(
            (item) => PlatformIcons[item as keyof typeof PlatformIcons]
          )}
        </div>
      </div>
    </div>
  );
}

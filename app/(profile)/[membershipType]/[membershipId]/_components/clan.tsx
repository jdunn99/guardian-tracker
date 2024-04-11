"use client";
import { GroupV2 } from "bungie-api-ts/groupv2";
import { BsPersonFill } from "react-icons/bs";

export function Clan(group: GroupV2) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase text-yellow-500 font-bold">Clan</div>
      <div className="flex items-center gap-4">
        {/* <Image
          src="/clan.svg"
          width={48}
          height={48}
          alt="clan-banner"
          className="opacity-80"
        /> */}
        <h3 className="text-slate-200">{group.name}</h3>
        <p className="text-slate-400 text-xs font-semibold inline-flex items-center gap-1">
          <BsPersonFill />
          {group.memberCount}
        </p>
      </div>
      <p className="text-slate-300 text-sm mb-2">{group.motto}</p>
      <p className="text-slate-400 text-xs">{group.about}</p>
    </div>
  );
}

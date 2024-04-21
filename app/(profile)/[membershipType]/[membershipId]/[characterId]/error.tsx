"use client";

import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.log(error.message);

  const router = useRouter();

  return (
    <div
      className="h-screen flex items-center justify-center flex-col"
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      <div className="fixed w-full h-64 inset-x-0 z-[99] bg-slate-800/50 border-t-8 shadow-xl border-red-500/50 backdrop-blur">
        <div className="grid grid-cols-4 h-full">
          <div className="w-full h-full bg-slate-900/50" />
          <div className="col-span-3 pb-2 relative">
            <div className="w-full p-8 bg-red-500/20">
              <h1 className="uppercase tracking-widest text-white font-bold md:text-3xl inline-flex items-center gap-2">
                ERROR
                <span className="md:text-xl text-sm">
                  {error.message === "SystemDisabled"
                    ? " - Bungie maintenance"
                    : ""}
                </span>
              </h1>
            </div>
            <div className="p-8 text-slate-400 w-full ">
              <p>
                {error.message === "SystemDisabled"
                  ? "The Bungie.net API is currently down for scheduled maintenance. Please check back later."
                  : error.message}
              </p>

              {/* <button className="pt-8" onClick={() => router.refresh()}>
                Reload
              </button> */}
            </div>
          </div>
          <div className="w-full p-1 absolute bottom-0 bg-slate-950">
            <div className="flex items-center container justify-end">
              <button
                className="text-slate-300 "
                onClick={() => router.refresh()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import client from "@/lib/bungie/client";
import Image from "next/image";
import { Suspense } from "react";

async function Test() {
  const data = await client.user.getUsersByPrefix("test");

  return (
    <Suspense fallback={<p>Loading</p>}>
      <p>{JSON.stringify(data)}</p>
    </Suspense>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <div className="max-w-screen-lg mx-auto break-words">
        <Test />
      </div>
    </main>
  );
}

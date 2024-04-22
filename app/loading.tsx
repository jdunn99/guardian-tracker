export default function Loading() {
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center"
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      <p className="text-slate-300">Downloading data from Bungie.net</p>
    </div>
  );
}

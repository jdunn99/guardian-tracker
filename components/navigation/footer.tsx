"use client";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 px-8 pb-12 text-sm text-white font-light sm:px-16 sm:pb-20 sm:pt-6 md:px-0 md:py-8 border-t border-slate-800/60 bg-slate-800/20">
      <div className="container flex flex-col-reverse justify-between gap-2 md:flex-row md:items-end">
        <span>
          Made with love by{" "}
          <a
            href="https://jackdunn.info/"
            target="_blank"
            className="text-yellow-500"
          >
            Jack Dunn
          </a>
        </span>
        <span>Github</span>
      </div>
    </footer>
  );
}

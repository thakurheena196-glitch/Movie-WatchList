export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="font-bold text-white">
            Cine<span className="text-indigo-400">Track</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Organize your movies. Track your journey.
          </p>
        </div>

        <p className="max-w-lg text-xs leading-5 text-slate-500">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>

        <p className="text-xs text-slate-600">Made for movie lovers 🎬</p>
      </div>
    </footer>
  );
}

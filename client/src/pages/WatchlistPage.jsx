import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { resolvePosterUrl } from "../api/axiosClient";
import StatusBadge from "../components/StatusBadge";

const TABS = [
  { key: "", label: "All Movies" },
  { key: "to_watch", label: "To Watch" },
  { key: "watching", label: "Watching" },
  { key: "done", label: "Completed" },
];

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};

        if (statusFilter) {
          params.status = statusFilter;
        }

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const res = await api.get("/api/watchlist", { params });

        setItems(res.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load your watchlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchWatchlist, 300);

    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm]);

  const totalMovies = items.length;
  const watchingCount = items.filter(
    (item) => item.status === "watching",
  ).length;
  const completedCount = items.filter((item) => item.status === "done").length;
  const toWatchCount = items.filter(
    (item) => item.status === "to_watch",
  ).length;

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Your Collection
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Watchlist
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Keep track of the movies you want to watch and the ones you've
            already enjoyed.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <span className="text-lg">+</span>
          Discover Movies
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total Movies",
            count: totalMovies,
            icon: "🎬",
            color: "text-indigo-300",
            bg: "bg-indigo-500/10",
          },
          {
            label: "To Watch",
            count: toWatchCount,
            icon: "📌",
            color: "text-sky-300",
            bg: "bg-sky-500/10",
          },
          {
            label: "Watching",
            count: watchingCount,
            icon: "▶",
            color: "text-amber-300",
            bg: "bg-amber-500/10",
          },
          {
            label: "Completed",
            count: completedCount,
            icon: "✓",
            color: "text-emerald-300",
            bg: "bg-emerald-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 sm:text-sm">
                {stat.label}
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                {stat.icon}
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {loading ? "—" : stat.count}
            </p>
          </div>
        ))}
      </section>

      {/* Filters and Search */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Your Movies</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select a movie to view or update its details.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Search your movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === tab.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          <p className="text-sm text-slate-400">
            Loading your movie collection...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-5 py-16 text-center">
          <div className="mb-4 text-5xl">🍿</div>

          <h3 className="text-xl font-bold text-white">
            {searchTerm || statusFilter
              ? "No matching movies"
              : "Your watchlist is empty"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
            {searchTerm || statusFilter
              ? "Try changing your search or selecting another status."
              : "Discover movies and add them here to start building your personal collection."}
          </p>

          <Link
            to="/search"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Explore Movies
          </Link>
        </div>
      )}

      {/* Movie Grid */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-slate-500">
            Showing {items.length} {items.length === 1 ? "movie" : "movies"}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              <Link
                key={item._id}
                to={`/movie/${item._id}`}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
                  <img
                    src={resolvePosterUrl(item)}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* Rating */}
                  {item.rating != null && (
                    <span className="absolute right-2 top-2 rounded-lg border border-slate-600/50 bg-slate-950/90 px-2 py-1 text-xs font-bold text-amber-400 backdrop-blur">
                      ★ {item.rating}/10
                    </span>
                  )}

                  {/* Poster Source */}
                  {item.posterSource === "custom" && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/90 px-2 py-1 text-[10px] font-medium text-indigo-300">
                      Custom Poster
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                    <span className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-950">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Movie Information */}
                <div className="space-y-3 p-3">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-white transition group-hover:text-indigo-300">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusBadge status={item.status} />

                    <span className="text-xs text-slate-500">
                      {item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

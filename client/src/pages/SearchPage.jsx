import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { resolvePosterUrl } from "../api/axiosClient";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedTmdbIds, setSavedTmdbIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const res = await api.get("/api/watchlist");
        const items = res.data.data || [];

        setSavedTmdbIds(new Set(items.map((movie) => Number(movie.tmdbId))));
      } catch (err) {
        throw err;
      }
    };

    loadWatchlist();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) return;

    setLoading(true);
    setError("");
    setFeedback({ type: "", text: "" });
    setHasSearched(true);
    setResults([]);

    try {
      // Correct backend route
      const res = await api.get("/api/movies/search", {
        params: {
          query: searchQuery,
          page: 1,
        },
      });

      const data = res.data.data;

      const movies = Array.isArray(data) ? data : data?.results || [];

      setResults(movies);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to search movies. Please try again.",
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (tmdbId) => {
    const numericId = Number(tmdbId);

    setAddingId(numericId);
    setFeedback({ type: "", text: "" });

    try {
      await api.post("/api/watchlist", {
        tmdbId: numericId,
      });

      setSavedTmdbIds((prev) => {
        const updated = new Set(prev);
        updated.add(numericId);
        return updated;
      });

      setFeedback({
        type: "success",
        text: "Movie added to your watchlist successfully!",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not add movie to watchlist.",
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-9">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="mb-3 inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300">
            DISCOVER MOVIES
          </span>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Your Next
            <span className="text-indigo-400"> Favorite Movie</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Search thousands of movies and add your favorites to your personal
            watchlist.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <svg
                className="h-5 w-5 shrink-0 text-slate-400"
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Inception, Interstellar, Dune..."
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Movies"}
            </button>
          </form>
        </div>
      </section>

      {/* Feedback */}
      {feedback.text && (
        <div
          role="status"
          className={`rounded-xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}

      {/* Section Heading */}
      {hasSearched && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">Search Results</h2>
            {!loading && !error && (
              <p className="mt-1 text-sm text-slate-400">
                {results.length} movies found for "{query}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          <p className="text-sm text-slate-400">
            Searching the movie database...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && hasSearched && !error && results.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-16 text-center">
          <div className="mb-4 text-5xl">🎬</div>
          <h3 className="text-lg font-semibold text-white">No movies found</h3>
          <p className="mt-2 text-sm text-slate-400">
            Try another movie title or check your spelling.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="rounded-2xl border border-dashed border-slate-800 py-14 text-center">
          <div className="mb-3 text-4xl">🍿</div>
          <h3 className="font-semibold text-white">Ready to discover?</h3>
          <p className="mt-2 text-sm text-slate-400">
            Search for your favorite movie to get started.
          </p>
        </div>
      )}

      {/* Movie Results */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((movie) => {
            const movieId = Number(movie.tmdbId);
            const isAdded = savedTmdbIds.has(movieId);
            const isAdding = addingId === movieId;

            return (
              <article
                key={movie.tmdbId}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-3 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="h-40 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-44 sm:w-32">
                  <img
                    src={resolvePosterUrl(movie)}
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-base font-bold text-white transition group-hover:text-indigo-300">
                        {movie.title}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {movie.releaseDate
                        ? movie.releaseDate.slice(0, 4)
                        : "Release date unavailable"}
                    </p>

                    <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-400">
                      {movie.overview || "No overview available."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddMovie(movie.tmdbId)}
                    disabled={isAdded || isAdding}
                    className={`mt-4 w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                      isAdded
                        ? "cursor-default border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
                    }`}
                  >
                    {isAdded
                      ? "✓ In Watchlist"
                      : isAdding
                        ? "Adding..."
                        : "+ Add to Watchlist"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

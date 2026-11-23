import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { resolvePosterUrl } from "../api/axiosClient";
import PosterUpload from "../components/PosterUpload";
import StatusBadge from "../components/StatusBadge";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("to_watch");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/api/watchlist/${id}`);
        const data = res.data.data;

        setItem(data);
        setStatus(data.status);
        setRating(data.rating ?? "");
        setNotes(data.notes || "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Movie not found.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        status,
        rating: status === "done" && rating !== "" ? Number(rating) : null,
        notes,
      };

      // Backend route uses PATCH, not PUT
      const res = await api.patch(`/api/watchlist/${id}`, payload);

      const updatedItem = res.data.data;

      setItem(updatedItem);
      setStatus(updatedItem.status);
      setRating(updatedItem.rating ?? "");
      setNotes(updatedItem.notes || "");

      setMessage("Your movie details have been saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update movie.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Remove "${item.title}" from your watchlist? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/api/watchlist/${id}`);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete movie.",
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        <p className="text-sm text-slate-400">Loading movie details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-16 text-center">
        <div className="mb-4 text-5xl">🎬</div>

        <h2 className="text-xl font-bold text-white">Movie not found</h2>

        <p className="mt-2 text-sm text-slate-400">
          {error || "This movie could not be found in your watchlist."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Back to Watchlist
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 text-white">
      {/* Back Navigation */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-indigo-400"
      >
        <span className="text-lg">←</span>
        Back to Watchlist
      </Link>

      {/* Movie Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                MOVIE DETAILS
              </span>

              <StatusBadge status={item.status} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {item.title}
            </h1>

            {item.releaseDate && (
              <p className="mt-3 text-sm text-slate-400">
                Release Date: {item.releaseDate}
              </p>
            )}

            {item.genres?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {item.rating != null && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2">
                <span className="text-xl text-amber-400">★</span>
                <span className="font-bold text-amber-300">
                  {item.rating}/10
                </span>
                <span className="text-xs text-slate-400">Your Rating</span>
              </div>
            )}
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-3xl">
            🎥
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
        {/* Left: Poster */}
        <aside className="space-y-5">
          <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl lg:mx-0 lg:max-w-none">
            <div className="aspect-[2/3]">
              <img
                src={resolvePosterUrl(item)}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster";
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="border-t border-slate-800 p-3">
              <p className="text-center text-xs text-slate-400">
                {item.posterSource === "custom"
                  ? "Using your custom poster"
                  : "Using TMDB poster"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-2 font-semibold text-white">Customize Poster</h2>

            <p className="mb-4 text-xs leading-5 text-slate-400">
              Upload your own movie poster to personalize your collection.
            </p>

            <PosterUpload
              itemId={item._id}
              onUploadSuccess={(updated) => {
                setItem(updated);
                setMessage("Poster updated successfully.");
                setError("");
              }}
            />
          </div>
        </aside>

        {/* Right: Movie Details and Edit Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white">About This Movie</h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {item.overview || "No overview available for this movie."}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <p className="text-xs text-slate-500">Release Year</p>
                <p className="mt-1 font-semibold text-white">
                  {item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <p className="text-xs text-slate-500">Genres</p>
                <p className="mt-1 font-semibold text-white">
                  {item.genres?.length || 0} Genres
                </p>
              </div>
            </div>
          </section>

          {/* Progress Form */}
          <form
            onSubmit={handleSave}
            className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white">
                Track Your Progress
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Update your watching status, rating and personal notes.
              </p>
            </div>

            {/* Status and Rating */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="movie-status"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Watch Status
                </label>

                <select
                  id="movie-status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);

                    if (e.target.value !== "done") {
                      setRating("");
                    }
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="to_watch">To Watch</option>
                  <option value="watching">Currently Watching</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="movie-rating"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Your Rating
                </label>

                <select
                  id="movie-rating"
                  value={rating}
                  disabled={status !== "done"}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <option value="">No Rating</option>

                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} / 10
                    </option>
                  ))}
                </select>

                {status !== "done" && (
                  <p className="mt-2 text-xs text-slate-500">
                    Complete the movie to give a rating.
                  </p>
                )}
              </div>
            </div>

            {/* Personal Notes */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="movie-notes"
                  className="text-sm font-medium text-slate-300"
                >
                  Personal Notes
                </label>

                <span className="text-xs text-slate-500">
                  {notes.length}/500
                </span>
              </div>

              <textarea
                id="movie-notes"
                rows={5}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your thoughts, favorite scenes, or who recommended this movie..."
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Feedback */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
              >
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Removing..." : "Delete Movie"}
              </button>

              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

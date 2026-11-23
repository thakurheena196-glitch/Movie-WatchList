import { useEffect, useState } from "react";
import api from "../api/axiosClient";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_SIZE = 2 * 1024 * 1024;

export default function PosterUpload({ itemId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setMessage("");
    setSelectedFile(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid format. Only JPEG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum allowed size is 2 MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile || uploading) return;

    const formData = new FormData();
    formData.append("poster", selectedFile);

    setUploading(true);
    setError("");
    setMessage("");

    try {
      // Backend route is POST /watchlist/:id/poster
      const res = await api.post(`/api/watchlist/${itemId}/poster`, formData);

      const updatedItem = res.data.data;

      setSelectedFile(null);
      setMessage("Custom poster uploaded successfully!");

      onUploadSuccess?.(updatedItem);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to upload custom poster.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
    >
      <div>
        <h3 className="font-semibold text-white">Upload Custom Poster</h3>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Personalize your movie with your own poster. JPEG, PNG or WebP.
          Maximum size: 2 MB.
        </p>
      </div>

      {/* File Input */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 p-5 text-center transition hover:border-indigo-500 hover:bg-indigo-500/5">
        <span className="mb-2 text-3xl">🖼️</span>

        <span className="text-sm font-semibold text-white">
          Choose Poster Image
        </span>

        <span className="mt-1 text-xs text-slate-500">
          Click to browse your files
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
      </label>

      {/* Selected File */}
      {selectedFile && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-300">Selected Image</p>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <img
              src={previewUrl}
              alt="Poster preview"
              className="h-28 w-20 rounded-lg border border-slate-700 object-cover"
            />

            <div className="min-w-0">
              <p className="break-all text-sm font-medium text-white">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <p className="mt-2 text-xs text-emerald-400">✓ Ready to upload</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
        >
          {message}
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading Poster..." : "Save Custom Poster"}
        </button>
      )}
    </form>
  );
}

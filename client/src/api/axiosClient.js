import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const resolvePosterUrl = (item) => {
  if (!item?.posterUrl) {
    return "https://placehold.co/500x750/1e293b/94a3b8?text=No+Poster";
  }
  if (
    item.posterSource === "custom" ||
    item.posterUrl.startsWith("/uploads/")
  ) {
    return `${API_BASE_URL}${item.posterUrl}`;
  }
  return item.posterUrl;
};

export default api;

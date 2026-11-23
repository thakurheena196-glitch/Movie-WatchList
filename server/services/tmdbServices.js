const axios = require("axios");

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    accept: "application/json",
  },
  timeout: 100000,
});
console.log(
  "process.env.TMDB_READ_ACCESS_TOKEN:",
  process.env.TMDB_READ_ACCESS_TOKEN,
);
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const searchMovies = async (query, page = 1) => {
  const response = await tmdbClient.get("/search/movie", {
    params: { query, page },
  });

  const results = (response.data.results || []).map((movie) => ({
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview || "",
    releaseDate: movie.release_date || "",
    posterUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : "",
  }));

  return {
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    results,
  };
};

// const getMovieDetails = async (tmdbId) => {
//   const response = await tmdbClient.get(`/movie/${tmdbId}`);
//   console.log("TMDB API response for movie details:", response.data); // Log the entire response data for debugging
//   const movie = response.data;

//   return {
//     tmdbId: movie.id,
//     title: movie.title,
//     overview: movie.overview || "",
//     releaseDate: movie.release_date || "",
//     genres: Array.isArray(movie.genres) ? movie.genres.map((g) => g.name) : [],
//     posterUrl: movie.poster_path
//       ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
//       : "",
//   };
// };
const getMovieDetails = async (tmdbId) => {
  try {
    console.log("Requesting TMDB movie ID:", tmdbId);

    const response = await tmdbClient.get(`/movie/${tmdbId}`);

    console.log("TMDB status:", response.status);
    console.log("Movie received:", response.data.title);

    const movie = response.data;

    return {
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview || "",
      releaseDate: movie.release_date || "",
      genres: Array.isArray(movie.genres)
        ? movie.genres.map((g) => g.name)
        : [],
      posterUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
        : "",
    };
  } catch (error) {
    console.error("TMDB ERROR:", {
      code: error.code,
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};
module.exports = {
  searchMovies,
  getMovieDetails,
};

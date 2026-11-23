# CineTrack — Movie Watchlist (MERN Stack)

A full-stack Movie Watchlist web application built with **MongoDB Atlas**, **Express**, **React (Vite + Tailwind CSS)**, and **Node.js**. Search movies via the TMDB API, import them into a personal watchlist, track watch status, ratings, and notes, and upload custom movie posters.

---

## Features

- **TMDB Movie Search:** Search movies through a secure backend proxy with poster, title, release year, and overview previews, plus loading, empty, and error states.
- **Import & Duplicate Protection:** Import movies from TMDB into MongoDB (`to_watch` by default) while blocking duplicate entries (`409 Conflict`).
- **Watchlist Management:** Filter saved movies by status (`All`, `To Watch`, `Watching`, `Done`) and search by title in real time.
- **Progress Tracking:** Update watch status, rate movies from `1–10` (enforced only when status is `Done`), and save personal notes (up to 500 characters).
- **Custom Poster Uploads:** Upload local posters (`JPEG`, `PNG`, or `WebP`, max `2 MB`) with live client-side preview. Automatically removes old custom files from disk when replaced or when a movie is deleted.
- **Health Monitoring:** `GET /health` endpoint reporting uptime, timestamp, and live Mongoose database connection state for uptime pingers.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Mongoose, Multer (`diskStorage`)
- **Database:** MongoDB Atlas (Free M0 Cluster)
- **External API:** The Movie Database (TMDB) v3 API

---

## Project Structure (MVC)

```text
movie-watchlist/
├── server/
│   ├── config/          # Database connection, environment loader, Multer setup
│   ├── controllers/     # Thin request/response handlers
│   ├── middlewares/     # File upload, request validation, centralized error handler
│   ├── models/          # Mongoose WatchlistItem schema
│   ├── routes/          # Express route definitions
│   ├── services/        # TMDB API integration
│   ├── uploads/         # Local custom poster storage (git-ignored)
│   ├── app.js           # Express app configuration & middleware
│   └── server.js        # Server entry point
└── client/
    └── src/
        ├── api/         # Axios instance & poster URL resolver
        ├── components/  # Navbar, Footer, StatusBadge, PosterUpload
        └── pages/       # WatchlistPage, SearchPage, MovieDetailPage
Before running this project, make sure you have:

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
2. **MongoDB Atlas Account** (Free M0 Cluster) — [Create here](https://www.mongodb.com/cloud/atlas)
3. **TMDB Account & API Read Access Token** — [Get free API credentials here](https://developer.themoviedb.org/docs/getting-started)
```

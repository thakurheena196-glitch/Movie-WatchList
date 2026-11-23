import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-col justify-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 self-center sm:self-auto"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-lg shadow-indigo-950/40">
            🎬
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Cine<span className="text-indigo-400">Track</span>
            </h1>
            <p className="text-[10px] font-medium tracking-widest text-slate-500">
              YOUR PERSONAL MOVIE LIBRARY
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-2">
          <NavLink to="/" className={linkClass} end>
            <span>▣</span>
            My Watchlist
          </NavLink>

          <NavLink to="/search" className={linkClass}>
            <span>＋</span>
            Discover Movies
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

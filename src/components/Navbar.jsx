import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-extrabold tracking-tight text-lg">
          Golf Directory
        </NavLink>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-700 hover:text-slate-900"
            }
          >
            Listings
          </NavLink>

          {/* Use an internal link to /submit */}
          <NavLink
            to="/submit"
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Add your listing
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

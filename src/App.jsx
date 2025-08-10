import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:slug" element={<ListingDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Golf Directory •{" "}
          <NavLink to="/listings" className="underline">
            Browse
          </NavLink>
        </div>
      </footer>
    </div>
  );
}

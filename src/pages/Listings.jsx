import { useEffect, useMemo, useState } from "react";
import ListingCard from "../components/ListingCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { fetchListings } from "../api/listings.js";

export default function Listings() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [indoor, setIndoor] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchListings({ q, city, indoor })
      .then((res) => {
        if (isMounted) {
          setData(res);
          setErr(null);
        }
      })
      .catch((e) => {
        if (isMounted) setErr(e.message || "Error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [q, city, indoor]);

  const count = data?.length || 0;

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold">All listings</h2>
      <FilterBar
        q={q}
        setQ={setQ}
        city={city}
        setCity={setCity}
        indoor={indoor}
        setIndoor={setIndoor}
      />

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {err && <p className="text-sm text-red-600">Error: {err}</p>}

      {!loading && !err && (
        <>
          <p className="text-xs text-slate-500">
            {count} result{count !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
          {count === 0 && (
            <p className="text-sm text-slate-500">
              No results. Try clearing filters.
            </p>
          )}
        </>
      )}
    </section>
  );
}

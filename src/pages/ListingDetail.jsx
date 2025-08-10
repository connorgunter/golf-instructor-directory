import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchListingBySlug } from "../api/listings.js";
import { currency } from "../utils/formatters";

export default function ListingDetail() {
  const { slug } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchListingBySlug(slug)
      .then((res) => {
        if (isMounted) setListing(res);
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
  }, [slug]);

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (err) return <p className="text-sm text-red-600">Error: {err}</p>;
  if (!listing)
    return (
      <div className="grid gap-2">
        <p>Listing not found.</p>
        <Link to="/listings" className="underline">
          Back to listings
        </Link>
      </div>
    );

  return (
    <article className="grid gap-6">
      <div className="rounded-2xl overflow-hidden border bg-white">
        <div className="aspect-[16/9] bg-slate-100">
          {listing.photo_url ? (
            <img
              src={listing.photo_url}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-slate-400">
              No photo
            </div>
          )}
        </div>
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">{listing.name}</h1>
          <p className="text-slate-600">
            {listing.city}, {listing.state}
          </p>
          <div className="flex flex-wrap gap-2">
            {listing.tags?.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          {listing.rate && (
            <p className="text-sm">
              Rates from <strong>{currency(listing.rate)}/hr</strong>
            </p>
          )}
          {listing.website && (
            <a
              className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              href={listing.website}
              target="_blank"
              rel="noreferrer"
            >
              Visit website
            </a>
          )}
        </div>
      </div>

      <Link to="/listings" className="text-sm underline text-slate-600">
        ← Back to all listings
      </Link>
    </article>
  );
}

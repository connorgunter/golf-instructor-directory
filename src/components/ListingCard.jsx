import { Link } from "react-router-dom";
import { currency } from "../utils/formatters";

export default function ListingCard({ item }) {
  return (
    <Link
      to={`/listings/${item.slug}`}
      className="block group rounded-xl border bg-white hover:shadow-md transition overflow-hidden"
    >
      <div className="aspect-[16/9] bg-slate-100">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-400">
            No photo
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
            {item.name}
          </h3>
          {item.isFeatured && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">
          {item.city}, {item.state}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {item.tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
        {item.rate && (
          <p className="mt-2 text-sm text-slate-700">
            From {currency(item.rate)}/hr
          </p>
        )}
      </div>
    </Link>
  );
}

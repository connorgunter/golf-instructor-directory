import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid gap-8">
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Find the right golf coach—fast.
        </h1>
        <p className="mt-2 text-slate-600">
          Browse vetted instructors, indoor simulators, and club fitters near
          you.
        </p>
        <div className="mt-6">
          <Link
            to="/listings"
            className="inline-block rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
          >
            Browse listings
          </Link>
        </div>
      </div>
      <ul className="text-sm text-slate-600 list-disc pl-5">
        <li>Filter by city, tags, and indoor availability</li>
        <li>Simple profiles now; provider dashboard coming next</li>
      </ul>
    </section>
  );
}

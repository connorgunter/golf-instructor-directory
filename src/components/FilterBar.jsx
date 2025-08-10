export default function FilterBar({
  q,
  setQ,
  city,
  setCity,
  indoor,
  setIndoor,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 bg-white p-4 rounded-xl border">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search coach, tag, specialty…"
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
      />
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City (e.g., Portsmouth)"
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
      />
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={indoor}
          onChange={(e) => setIndoor(e.target.checked)}
        />
        Indoor sims available
      </label>
    </div>
  );
}

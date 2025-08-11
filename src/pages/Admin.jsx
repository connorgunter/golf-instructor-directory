import { useEffect, useState } from "react";
const FN = "/.netlify/functions";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("ADMIN_TOKEN") || "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${FN}/get-pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error");
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [token]);

  function saveToken() {
    localStorage.setItem("ADMIN_TOKEN", token);
    load();
  }

  async function act(id, action) {
    const res = await fetch(`${FN}/approve-listing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) setData((d) => d.filter((x) => x.id !== id));
    else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Failed");
    }
  }

  return (
    <section className="grid gap-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Admin — Pending Listings</h1>

      <div className="grid gap-2 bg-white border p-4 rounded-xl">
        <label className="text-sm font-medium">Admin token</label>
        <div className="flex gap-2">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste ADMIN_DASH_TOKEN"
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <button
            onClick={saveToken}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white"
          >
            Save
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Stored locally in your browser. Keep it private.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {err && <p className="text-sm text-red-600">Error: {err}</p>}

      <div className="grid gap-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-slate-600">
                {item.city}, {item.state} • <code>{item.slug}</code>
              </div>
              {item.website && (
                <a
                  className="text-xs underline"
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.website}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => act(item.id, "active")}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white"
              >
                Approve
              </button>
              <button
                onClick={() => act(item.id, "hidden")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white"
              >
                Hide
              </button>
            </div>
          </div>
        ))}
        {!loading && data.length === 0 && (
          <p className="text-sm text-slate-500">No pending listings.</p>
        )}
      </div>
    </section>
  );
}

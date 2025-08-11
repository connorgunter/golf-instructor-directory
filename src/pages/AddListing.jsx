import { useState } from "react";
import { createPendingListing, makeSlug } from "../api/listings";

export default function AddListing() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    website: "",
    email_public: "",
    phone_public: "",
    rate: "",
    indoor: false,
    tags: "",
    specialties: "",
    photo_url: "",
    hp_trap: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState("");

  const slugPreview = makeSlug(form.name, form.city);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk(null);

    // Honeypot: bots fill hidden field
    if (form.hp_trap) return;

    // Minimal validation
    if (!form.name || !form.city || !form.state)
      return setErr("Name, City, and State are required.");
    if (form.state.length !== 2)
      return setErr("Use a 2-letter state code (e.g., NH).");

    try {
      setLoading(true);
      const res = await createPendingListing(form);
      setOk({
        message: "Thanks! Your listing was submitted for review.",
        slug: res.slug,
      });
      setForm({
        name: "",
        city: "",
        state: "",
        website: "",
        email_public: "",
        phone_public: "",
        rate: "",
        indoor: false,
        tags: "",
        specialties: "",
        photo_url: "",
        hp_trap: "",
      });
    } catch (e2) {
      setErr(e2.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto grid gap-4">
      <h1 className="text-2xl font-bold">Add your listing</h1>
      <p className="text-sm text-slate-600">
        Submit your golf coaching business. We’ll review and publish within
        24–48 hours.
      </p>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 bg-white border p-4 rounded-xl"
      >
        <div className="grid gap-2">
          <label className="text-sm font-medium">Business name *</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Fitz Golf Coaching"
            className="rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="grid gap-2 col-span-2">
            <label className="text-sm font-medium">City *</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Portsmouth"
              className="rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">State (2-letter) *</label>
            <input
              name="state"
              value={form.state}
              onChange={onChange}
              maxLength={2}
              placeholder="NH"
              className="rounded-lg border px-3 py-2 uppercase"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={onChange}
              placeholder="https://example.com"
              className="rounded-lg border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Public email</label>
            <input
              name="email_public"
              value={form.email_public}
              onChange={onChange}
              placeholder="hello@example.com"
              className="rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Public phone</label>
            <input
              name="phone_public"
              value={form.phone_public}
              onChange={onChange}
              placeholder="555-123-4567"
              className="rounded-lg border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Starting rate (USD/hr)
            </label>
            <input
              name="rate"
              type="number"
              min="0"
              value={form.rate}
              onChange={onChange}
              placeholder="95"
              className="rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="beginner-friendly, short game, video analysis"
              className="rounded-lg border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Specialties (comma separated)
            </label>
            <input
              name="specialties"
              value={form.specialties}
              onChange={onChange}
              placeholder="Putting, Chipping"
              className="rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Cover photo URL</label>
            <input
              name="photo_url"
              value={form.photo_url}
              onChange={onChange}
              placeholder="https://..."
              className="rounded-lg border px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 text-sm mt-7">
            <input
              type="checkbox"
              name="indoor"
              checked={form.indoor}
              onChange={onChange}
            />
            Indoor simulators available
          </label>
        </div>

        {/* Honeypot anti-spam (hidden via CSS) */}
        <div className="hidden">
          <label>Leave this empty</label>
          <input name="hp_trap" value={form.hp_trap} onChange={onChange} />
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit for review"}
          </button>
          <span className="text-xs text-slate-500">
            Slug preview: <code>{slugPreview}</code>
          </span>
        </div>

        {ok && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
            {ok.message} (Preview URL will be <code>/listings/{ok.slug}</code>{" "}
            once approved.)
          </div>
        )}
        {err && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {err}
          </div>
        )}
      </form>
    </section>
  );
}

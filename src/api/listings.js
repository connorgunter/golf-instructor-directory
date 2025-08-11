// src/api/listings.js
import { supabase } from "../lib/supabase";

/* ---------- helpers ---------- */
export function makeSlug(name = "", city = "") {
  const base = `${name} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-golf-coach`.replace(/--+/g, "-");
}

export function csvToArray(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ---------- reads ---------- */
export async function fetchListings(opts = {}) {
  let { q = "", city = "", indoor = false } = opts;
  q = q.trim();
  city = city.trim();

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (city) query = query.ilike("city", `%${city}%`);
  if (indoor) query = query.eq("indoor", true);

  if (q) {
    const qLike = `%${q}%`;
    query = query.or(
      `name.ilike.${qLike},website.ilike.${qLike},city.ilike.${qLike}`
    );
    if (!q.includes(" ")) query = query.contains("tags", [q.toLowerCase()]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchListingBySlug(slug) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/* ---------- creates ---------- */
export async function createPendingListing(payload) {
  const clean = {
    slug: makeSlug(payload.name, payload.city),
    name: payload.name?.trim(),
    city: payload.city?.trim(),
    state: payload.state?.trim()?.toUpperCase(),
    rate:
      payload.rate !== "" && payload.rate != null ? Number(payload.rate) : null,
    indoor: !!payload.indoor,
    tags: Array.isArray(payload.tags) ? payload.tags : csvToArray(payload.tags),
    specialties: Array.isArray(payload.specialties)
      ? payload.specialties
      : csvToArray(payload.specialties),
    website: payload.website?.trim() || null,
    email_public: payload.email_public?.trim() || null,
    phone_public: payload.phone_public?.trim() || null,
    photo_url: payload.photo_url?.trim() || null,
    is_featured: false,
    status: "pending",
  };

  // optional pre-check for slug collision using public SELECT (safe)
  const { data: exists, error: existsErr } = await supabase
    .from("listings")
    .select("id")
    .eq("slug", clean.slug)
    .limit(1);
  if (existsErr) throw existsErr;
  if (exists?.length)
    throw new Error(
      "This business already seems submitted. Try tweaking name or city."
    );

  // IMPORTANT: don't select after insert (or you'll need a select policy on pending)
  const { error } = await supabase
    .from("listings")
    .insert([clean], { returning: "minimal" }); // <- no row returned

  if (error) throw error;
  // return what the UI needs (we already know the slug)
  return { slug: clean.slug };
}

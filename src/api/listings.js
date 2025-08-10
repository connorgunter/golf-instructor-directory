import { supabase } from "../lib/supabase";

/**
 * Fetch list of listings with optional filters.
 * @param {{ q?: string; city?: string; indoor?: boolean }} opts
 */
export async function fetchListings(opts = {}) {
  const { q = "", city = "", indoor = false } = opts;

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (city) query = query.ilike("city", `%${city}%`);
  if (indoor) query = query.eq("indoor", true);

  // Basic text search across name/tags/specialties
  if (q) {
    // ilike on text cols; array search uses contains with {}
    const qLike = `%${q}%`;
    query = query.or(`name.ilike.${qLike},website.ilike.${qLike}`);
    // If q looks like a single word, also try array contains
    if (!q.includes(" ")) {
      query = query.contains("tags", [q]);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Fetch one listing by slug */
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

import { getAdminSupabase, requireAdmin } from "./_supabaseClient.js";

export const handler = async (event) => {
  const unauthorized = requireAdmin(event);
  if (unauthorized) return unauthorized;

  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  return { statusCode: 200, body: JSON.stringify({ data }) };
};

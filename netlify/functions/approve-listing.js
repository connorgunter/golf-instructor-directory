import { getAdminSupabase, requireAdmin } from "./_supabaseClient.js";

export const handler = async (event) => {
  const unauthorized = requireAdmin(event);
  if (unauthorized) return unauthorized;
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { id, action } = JSON.parse(event.body || "{}");
  if (!id || !["active", "hidden"].includes(action)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Bad request" }) };
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("listings")
    .update({ status: action })
    .eq("id", id);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};

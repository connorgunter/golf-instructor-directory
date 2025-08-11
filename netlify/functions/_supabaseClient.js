import { createClient } from "@supabase/supabase-js";

export function getAdminSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // NEVER expose to client
  if (!url || !serviceRole) throw new Error("Missing Supabase env vars");
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}

export function requireAdmin(event) {
  const sent = event.headers.authorization || event.headers.Authorization;
  const expected = `Bearer ${process.env.ADMIN_DASH_TOKEN}`;
  if (!sent || sent !== expected) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }
  return null;
}

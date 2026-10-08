import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseUrl() {
  let url = process.env.SUPABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!url) return "";
  if (url.endsWith("/rest/v1/")) {
    url = url.slice(0, -"/rest/v1/".length);
  } else if (url.endsWith("/rest/v1")) {
    url = url.slice(0, -"/rest/v1".length);
  }
  return url.replace(/\/+$/, "");
}

function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY?.trim().replace(/^["']|["']$/g, "");
}

function getSupabasePublishableKey() {
  return process.env.SUPABASE_PUBLISHABLE_KEY?.trim().replace(/^["']|["']$/g, "");
}

// 1. Koneksi server untuk pengunjung (SUPABASE_SECRET_KEY)
// Digunakan untuk membaca katalog dan detail produk tanpa login
export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = getSupabaseSecretKey();

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;

// 2. Koneksi sesi admin (SUPABASE_PUBLISHABLE_KEY + cookie login)
// Digunakan untuk Auth: login, keluar, ganti password, dan pengecekan sesi admin
export async function createAuthClient() {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  const cookieStore = await cookies();

  return createSSRServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component, abaikan jika tidak bisa set cookie
        }
      },
    },
  });
}

export default createClient;
"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server";

export async function login(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/admin/login?error=" + encodeURIComponent("Email dan password wajib diisi."));
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=" + encodeURIComponent("Email atau password salah."));
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(formData) {
  const passwordBaru = formData.get("password_baru")?.toString();
  const konfirmasiPassword = formData.get("konfirmasi_password")?.toString();

  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=" + encodeURIComponent("Sesi telah berakhir. Silakan login kembali."));
  }

  if (!passwordBaru || passwordBaru.length < 8) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Password baru minimal 8 karakter.")
    );
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Konfirmasi password tidak cocok.")
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    redirect("/admin/password?error=" + encodeURIComponent(error.message));
  }

  redirect("/admin/password?berhasil=1");
}


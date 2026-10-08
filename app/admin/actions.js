"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

// US-08: Tambah Produk
export async function tambahProduk(formData) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=" + encodeURIComponent("Anda harus login terlebih dahulu."));
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;

  if (!nama) {
    redirect("/admin/produk/baru?error=" + encodeURIComponent("Nama produk wajib diisi."));
  }

  const { error } = await supabase.from("produk").insert([
    { nama, harga, kategori, deskripsi, foto_url },
  ]);

  if (error) {
    redirect("/admin/produk/baru?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// US-09: Ubah Produk
export async function ubahProduk(id, formData) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=" + encodeURIComponent("Anda harus login terlebih dahulu."));
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;

  if (!nama) {
    redirect(`/admin/produk/${id}/ubah?error=` + encodeURIComponent("Nama produk wajib diisi."));
  }

  const { error } = await supabase
    .from("produk")
    .update({ nama, harga, kategori, deskripsi, foto_url })
    .eq("id", id);

  if (error) {
    redirect(`/admin/produk/${id}/ubah?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

// US-10: Hapus Produk
export async function hapusProduk(formData) {
  const id = formData.get("id")?.toString();

  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=" + encodeURIComponent("Anda harus login terlebih dahulu."));
  }

  if (id) {
    await supabase.from("produk").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin");
}

// US-14: Deskripsi produk dibuat AI (Gemini API)
export async function buatDeskripsiAI(nama, kategori) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Buatkan 1-2 kalimat deskripsi produk yang menarik, ramah, dan menggugah minat pembeli untuk katalog UMKM dalam bahasa Indonesia. Nama produk: "${nama}", Kategori: "${kategori || 'Umum'}". Berikan teks deskripsinya saja tanpa pengantar atau tanda kutip.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (generated) {
        return { text: generated };
      }
    } catch {
      // Jika terjadi error pada request, gunakan fallback cerdas
    }
  }

  // Fallback deskripsi otomatis jika API Key belum dipasang
  const deskripsiCerdas = `${nama} istimewa dari kategori ${kategori || "UMKM"}, dibuat dengan bahan pilihan berkualitas dan higienis. Cocok dinikmati sendiri maupun dijadikan oleh-oleh terbaik.`;
  return { text: deskripsiCerdas };
}

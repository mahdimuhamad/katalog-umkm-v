import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kataKunci = (params?.q || "").trim().toLowerCase();
  const filterKategori = (params?.kategori || "").trim();

  let semuaProduk = [];
  let pesanError = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      semuaProduk = data ?? [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal menghubungkan ke Supabase.";
  }

  // Ambil daftar kategori unik untuk tombol filter (US-11)
  const kategoriList = Array.from(
    new Set(semuaProduk.map((p) => p.kategori).filter(Boolean))
  );

  // Filter produk berdasarkan pencarian nama dan kategori (US-11)
  const daftarProduk = semuaProduk.filter((produk) => {
    const cocokNama = kataKunci
      ? produk.nama?.toLowerCase().includes(kataKunci)
      : true;
    const cocokKategori = filterKategori
      ? produk.kategori === filterKategori
      : true;
    return cocokNama && cocokKategori;
  });

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian (US-11) */}
          <form method="GET" className="flex items-center gap-2">
            {filterKategori && (
              <input type="hidden" name="kategori" value={filterKategori} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={params?.q || ""}
              placeholder="Cari nama produk..."
              className="w-full rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              className="rounded-lg bg-utama px-3 py-1.5 text-sm font-semibold text-white hover:bg-utama-gelap cursor-pointer"
            >
              Cari
            </button>
            {kataKunci && (
              <Link
                href={filterKategori ? `/?kategori=${encodeURIComponent(filterKategori)}` : "/"}
                className="text-xs text-teks-lembut hover:text-bahaya underline"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori (US-11) */}
        {kategoriList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={kataKunci ? `/?q=${encodeURIComponent(kataKunci)}` : "/"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                !filterKategori
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </Link>
            {kategoriList.map((kat) => {
              const aktif = filterKategori === kat;
              const linkUrl = `/?kategori=${encodeURIComponent(kat)}${
                kataKunci ? `&q=${encodeURIComponent(kataKunci)}` : ""
              }`;
              return (
                <Link
                  key={kat}
                  href={linkUrl}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-sm text-bahaya">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-6 text-teks-lembut">
            {kataKunci || filterKategori
              ? "Tidak ada produk yang cocok dengan pencarian atau filter Anda."
              : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
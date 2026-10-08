"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  if (daftarProduk.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-garis py-12 text-center text-teks-lembut">
        Belum ada produk. Klik tombol &quot;Tambah produk&quot; untuk menambahkan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-garis">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-garis bg-permukaan text-xs font-semibold uppercase tracking-wider text-teks-lembut">
          <tr>
            <th className="px-4 py-3">Produk</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Harga</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-garis bg-latar">
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="hover:bg-permukaan/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={produk.foto_url || "/produk/kopi.svg"}
                    alt={produk.nama}
                    className="h-10 w-10 rounded-lg bg-permukaan object-cover"
                  />
                  <span className="font-semibold text-teks">{produk.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "-"}</td>
              <td className="px-4 py-3 font-medium text-harga">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/admin/produk/${produk.id}/ubah`}
                    className="rounded-md border border-garis px-2.5 py-1 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    Ubah
                  </Link>
                  <form
                    action={hapusProduk}
                    onSubmit={(e) => {
                      if (!confirm(`Yakin ingin menghapus produk "${produk.nama}"?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={produk.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-garis px-2.5 py-1 text-xs font-semibold text-bahaya hover:border-bahaya cursor-pointer"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

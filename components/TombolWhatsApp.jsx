"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const totalHarga = (produk.harga || 0) * jumlah;
  const nomor = toko.nomorWhatsApp?.replace(/\D/g, "");

  const pesan = `Halo, saya mau pesan ${jumlah}x ${produk.nama} (Total: ${formatRupiah(totalHarga)})`;
  const linkWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  function kurang() {
    if (jumlah > 1) setJumlah((prev) => prev - 1);
  }

  function tambah() {
    setJumlah((prev) => prev + 1);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Pengatur Jumlah (US-12) */}
      <div className="flex items-center gap-2 self-start rounded-lg border border-garis bg-permukaan p-1">
        <span className="px-2 text-xs font-semibold text-teks-lembut">Jumlah:</span>
        <button
          type="button"
          onClick={kurang}
          disabled={jumlah <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-latar font-bold text-teks shadow-xs hover:bg-garis disabled:opacity-40 cursor-pointer"
          aria-label="Kurangi jumlah"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-bold text-teks">{jumlah}</span>
        <button
          type="button"
          onClick={tambah}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-latar font-bold text-teks shadow-xs hover:bg-garis cursor-pointer"
          aria-label="Tambah jumlah"
        >
          +
        </button>
      </div>

      {/* Tombol WhatsApp (US-03 & US-12) */}
      <a
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp ({formatRupiah(totalHarga)})
      </a>
    </div>
  );
}

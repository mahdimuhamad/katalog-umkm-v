"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

export default function FormProduk({ produk, labelTombol = "Simpan", action }) {
  const [nama, setNama] = useState(produk?.nama || "");
  const [kategori, setKategori] = useState(produk?.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk?.deskripsi || "");
  const [memuatAI, setMemuatAI] = useState(false);

  async function tanganiBuatDeskripsiAI() {
    if (!nama.trim()) {
      alert("Harap isi nama produk terlebih dahulu sebelum membuat deskripsi dengan AI.");
      return;
    }
    setMemuatAI(true);
    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res?.text) {
        setDeskripsi(res.text);
      }
    } catch {
      alert("Gagal membuat deskripsi dengan AI.");
    } finally {
      setMemuatAI(false);
    }
  }

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Contoh: Kopi Robusta 250 g"
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          defaultValue={produk?.harga || ""}
          placeholder="Contoh: 45000"
          min="0"
          required
        />
        <Input
          label="Kategori"
          name="kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          placeholder="Contoh: Minuman, Camilan"
        />
      </div>

      <Input
        label="Link foto produk"
        name="foto_url"
        defaultValue={produk?.foto_url || ""}
        placeholder="Contoh: /produk/kopi.svg atau https://..."
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-teks">Deskripsi</label>
          <button
            type="button"
            onClick={tanganiBuatDeskripsiAI}
            disabled={memuatAI}
            className="inline-flex items-center gap-1 rounded-md bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama hover:bg-garis disabled:opacity-50 cursor-pointer"
          >
            {memuatAI ? "Membuat deskripsi..." : "✨ Buat deskripsi dengan AI (US-14)"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Penjelasan produk atau buat otomatis dengan AI..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <Tombol type="submit" className="mt-2 self-start">
        {labelTombol}
      </Tombol>
    </form>
  );
}

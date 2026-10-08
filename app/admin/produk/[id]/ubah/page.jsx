import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }
    produk = data;
  } catch {
    notFound();
  }

  const ubahProdukDenganId = ubahProduk.bind(null, id);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk
        produk={produk}
        action={ubahProdukDenganId}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}

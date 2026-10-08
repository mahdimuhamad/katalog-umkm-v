import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

export default async function HalamanGantiPassword({ searchParams }) {
  const params = await searchParams;
  const pesanError = params?.error;
  const berhasil = params?.berhasil;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ganti password</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ganti password bawaan segera setelah pertama kali masuk. Minimal 8 karakter.
        </p>
      </div>

      {pesanError && (
        <div className="max-w-sm rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-sm text-bahaya">
          <p className="font-semibold">{pesanError}</p>
        </div>
      )}

      {berhasil && (
        <div className="max-w-sm rounded-xl border border-utama/30 bg-utama/10 p-4 text-sm text-utama">
          <p className="font-semibold">Password berhasil diganti.</p>
        </div>
      )}

      <form action={gantiPassword} className="flex max-w-sm flex-col gap-4">
        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Tombol type="submit" className="self-start">
          Simpan password
        </Tombol>
      </form>
    </div>
  );
}

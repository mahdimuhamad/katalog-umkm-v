# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
File `lib/supabase/server.js` dibuat untuk koneksi server dan `app/page.jsx` berhasil membaca data produk dari tabel `produk` di Supabase. `CatatanBelumAktif` dihapus dan pesan error/tabel kosong ditangani dengan baik.

**Perbaikan:**
Format `SUPABASE_URL` di `.env.local` diperbaiki dari yang sebelumnya ada tanda kutip dan akhiran `/rest/v1/` menjadi format URL murni `https://<id>.supabase.co`.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Halaman `app/produk/[id]/page.jsx` berhasil membaca data produk secara spesifik dari Supabase menggunakan ID dan menampilkan detail produk dengan lengkap. Jika ID tidak ditemukan, otomatis menampilkan halaman 404 (notFound).

**Perbaikan:**
Tidak ada error, integrasi berhasil.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Tombol WhatsApp di `components/TombolWhatsApp.jsx` kini mengarah langsung ke `https://wa.me/<nomor>` dengan template pesan otomatis nama produk dan harga terformat rupiah, membuka tab baru dengan aman (`target="_blank"` dan `rel="noopener noreferrer"`).

**Perbaikan:**
Membersihkan karakter non-digit pada nomor WhatsApp di `lib/toko.js`.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Fungsi `login` dan `logout` Server Action dibuat di `app/admin/actions.js`. Form login di `app/admin/login/page.jsx` tersambung dan menampilkan pesan error jika autentikasi gagal. Tombol "Keluar" di `components/NavAdmin.jsx` berhasil mengakhiri sesi.

**Perbaikan:**
Menyesuaikan penanganan cookies asinkronus (`await cookies()`) untuk Next.js 16.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Server Action `gantiPassword` dibuat dengan validasi autentikasi pengguna, panjang minimal 8 karakter, dan kecocokan password konfirmasi. `app/admin/password/page.jsx` menampilkan notifikasi status keberhasilan atau kegagalan.

**Perbaikan:**
Pengecekan keamanan server memastikan hanya sesi admin aktif yang dapat mengeksekusi ganti password.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
File `proxy.js` dibuat di root untuk memproteksi semua sub-rute `/admin`. Pengguna yang belum login otomatis dialihkan ke `/admin/login`, dan pengguna yang sudah login dialihkan langsung ke `/admin`. `CatatanBelumAktif` di `app/admin/page.jsx` dihapus.

**Perbaikan:**
Mengecualikan rute `/admin/login` agar tidak terjadi perulangan pengalihan (redirect loop).

## Debugging dan fitur bonus

**Error: Invalid path specified in request URL**
- Masalah: Nilai `SUPABASE_URL` di `.env.local` memiliki spasi, tanda kutip, dan tambahan endpoint `/rest/v1/` di bagian akhir.
- Solusi: Menghapus spasi, tanda kutip, dan path `/rest/v1/` sehingga formatnya menjadi URL murni `https://<id>.supabase.co`. Serta menambahkan sanitasi otomatis pada `lib/supabase/server.js`.

**Fitur Bonus US-07: Daftar Produk Admin dari Database**
- `app/admin/page.jsx` langsung membaca data produk dari tabel `produk` di Supabase dan menampilkannya di tabel admin.

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

## US-07 List produk di halaman admin

**Prompt:** **[SENDIRI]**
Ubah app/admin/page.jsx agar menampilkan daftar produk langsung dari database Supabase dan memformat harga serta gambar produk secara rapi.

**Hasil:**
Halaman admin membaca tabel `produk` langsung dari database Supabase secara dinamis di sisi server.

**Perbaikan:**
Ditambahkan penanganan jika data produk kosong pada `TabelProduk`.

## US-08 Tambah produk

**Prompt:** **[SENDIRI]**
Buat Server Action tambahProduk di app/admin/actions.js yang memeriksa sesi admin login, lalu menyimpan nama, harga, kategori, deskripsi, dan foto_url ke tabel produk Supabase. Sambungkan form di app/admin/produk/baru/page.jsx.

**Hasil:**
Admin dapat menambahkan produk baru dari form `/admin/produk/baru`, dan produk otomatis tersimpan ke Supabase lalu dialihkan kembali ke `/admin`.

**Perbaikan:**
Memastikan revalidasi cache `revalidatePath` agar katalog dan daftar admin langsung memperbarui daftar produk.

## US-09 Ubah produk

**Prompt:** **[SENDIRI]**
Buat form ubah produk di app/admin/produk/[id]/ubah/page.jsx yang mengambil data produk lama dari Supabase, dan Server Action ubahProduk untuk menyimpan perubahan kembali ke database dengan proteksi login.

**Hasil:**
Data lama produk terisi otomatis di form ubah produk dan pembaruan data berhasil disimpan ke Supabase.

**Perbaikan:**
Binding ID produk ke Server Action untuk pembaruan data yang akurat.

## US-10 Hapus produk

**Prompt:** **[SENDIRI]**
Tambahkan tombol hapus produk dengan konfirmasi dialog browser di components/TabelProduk.jsx dan Server Action hapusProduk di app/admin/actions.js yang terlindungi login.

**Hasil:**
Admin dapat menghapus produk dari database setelah menyetujui konfirmasi dialog browser.

**Perbaikan:**
Menambahkan konfirmasi `confirm()` pada form sebelum submit.

## US-11 Filter kategori atau pencarian

**Prompt:** **[SENDIRI]**
Tambahkan fitur pencarian produk berdasarkan nama dan filter kategori di app/page.jsx secara responsif.

**Hasil:**
Pengunjung dapat mencari nama produk melalui input pencarian dan memfilter produk berdasarkan kategori pilihan.

**Perbaikan:**
Menampilkan opsi tombol kategori dinamis berdasarkan data produk yang tersedia di database.

## US-12 Pilih jumlah atau varian

**Prompt:** **[SENDIRI]**
Tambahkan pengatur jumlah produk (counter + / -) pada components/TombolWhatsApp.jsx sehingga total harga dan jumlah produk otomatis terhitung dan tertulis di pesan WhatsApp.

**Hasil:**
Pengunjung dapat memilih jumlah pesanan dan tautan WhatsApp memuat format pesan lengkap seperti `Halo, saya mau pesan 2x Kopi Bubuk Robusta (Total: Rp 90.000)`.

**Perbaikan:**
Validasi jumlah minimal 1 pesanan.

## US-13 PWA

**Prompt:** **[SENDIRI]**
Buat manifest.json di folder public dan konfigurasikan metadata PWA di app/layout.jsx agar aplikasi dapat diinstal di HP layaknya aplikasi native.

**Hasil:**
Aplikasi kini mendukung PWA dengan manifest web app dan icon yang dapat diinstall di layar HP.

**Perbaikan:**
Menambahkan meta tag theme-color dan appleWebApp di header.

## US-14 Deskripsi produk dibuat AI

**Prompt:** **[SENDIRI]**
Integrasikan AI (Gemini API) untuk membuat deskripsi produk secara otomatis dari nama dan kategori produk pada form produk admin di components/FormProduk.jsx.

**Hasil:**
Admin cukup mengklik tombol "✨ Buat deskripsi dengan AI", dan AI akan mengisi kotak deskripsi produk dengan narasi yang menarik secara otomatis.

**Perbaikan:**
Menyediakan fallback generator deskripsi yang cerdas jika GEMINI_API_KEY belum dikonfigurasi di environment variable.

# Lanjutan Demo Nama Mahasiswa

Proyek ini melanjutkan **src.rar**: data awal Budi dan Siti, endpoint `/hello`, serta GET, POST, PUT, DELETE tetap mengikuti sumber yang diunggah. Halaman web sederhana memakai API yang sama untuk menampilkan, menambah, mengubah, dan menghapus data.

## Menjalankan

Gunakan Node.js 24 atau lebih baru. Buka folder `demo-nama-mahasiswa-web` di VS Code. Pada terminal di folder yang memiliki `package.json`:

```bash
npm ci
npm run dev
```

Website: **http://localhost:3000**

API: **http://localhost:3000/hello**

Hentikan server sebelumnya jika port 3000 sedang digunakan. Buka halaman melalui Express, bukan klik langsung HTML atau melalui Live Server. Selalu jalankan server dari folder proyek karena `express.static("public")` memakai path relatif.

Untuk memeriksa TypeScript serta menjalankan hasil kompilasi:

```bash
npm run build
npm start
```

Jalankan dev atau start bergantian. Konfigurasi root disertakan agar proyek dapat langsung dijalankan, karena arsip yang diunggah hanya berisi folder src. Konfigurasi ini memakai Express 5 dan TypeScript; handler asli tetap sama. `npm run dev` pada paket ini memakai watch, sehingga perubahan kode server memicu restart.

## Jika melanjutkan folder proyek lama

1. Salin folder `public` ke folder proyek lama, sejajar dengan `src` dan `package.json`.
2. Tambahkan pada `src/app.ts`, setelah `app.use(requestLogger)`:

```typescript
app.use(express.static("public"));
```

3. Hentikan server lalu jalankan kembali. Buka `http://localhost:3000`.

Controller, router, logger, dan index asli tidak perlu diganti. Untuk cara ini, dependency dan script npm tetap mengikuti proyek lama.

## Perubahan berkas

| Berkas | Perubahan |
| --- | --- |
| `src/app.ts` | Tambahan express.static untuk folder public |
| `src/controllers/hello.controller.ts` | Menggunakan sumber asli |
| `src/routes/hello.routes.ts` | Menggunakan sumber asli |
| `src/middleware/request-logger.ts` | Menggunakan sumber asli |
| `src/index.ts` | Menggunakan sumber asli |
| `package-lock.json` | Lock dependency agar `npm ci` dapat dipakai |
| `public/index.html` | Form tambah/edit dan tabel kolom ID, nama, serta aksi |
| `public/style.css` | CSS sederhana dengan warna biru pastel dan aksen pink |
| `public/script.js` | GET, POST, PUT, DELETE, mode edit, konfirmasi hapus, dan pesan request |

## Demo 1: empat method melalui Postman

| Method | URL | Body JSON | Status sukses |
| --- | --- | --- | --- |
| GET | `http://localhost:3000/hello` | Tidak ada | 200 |
| POST | `http://localhost:3000/hello` | `{"nama":"Andi"}` | 201 |
| PUT | `http://localhost:3000/hello/3` | `{"nama":"Andi Pratama"}` | 200 |
| DELETE | `http://localhost:3000/hello/3` | Tidak ada | 200 |

Mulai dengan GET, lalu POST, PUT, dan DELETE. Pada server yang baru dimulai, ID hasil POST pertama adalah 3. Gunakan ID dari response jika menjalankan POST lebih dari sekali. Ulangi GET setelah setiap perubahan.

Untuk POST dan PUT, pilih Body → raw → JSON agar header `Content-Type: application/json` tersedia. Untuk DELETE pilih Body: none. Nama kosong atau bukan teks menghasilkan 400; ID tidak ditemukan menghasilkan 404.

## Demo 2: halaman web untuk empat method

1. Buka `http://localhost:3000`. Script memanggil GET `/hello`, membaca `hasil.data`, lalu menampilkan tabel.
2. Isi nama mahasiswa, misalnya Rina, lalu klik **Tambah nama**. Script mengirim POST `/hello` dengan body `{"nama":"Rina"}`.
3. Klik **Edit** pada baris yang ingin diubah. Nama masuk ke form, lalu tombol berubah menjadi **Simpan perubahan**. Klik **Batal** jika tidak jadi mengubah.
4. Klik **Simpan perubahan** untuk mengirim PUT `/hello/:id`. Setelah berhasil, tabel dimuat ulang dengan GET.
5. Klik **Hapus**, setujui `confirm()`, lalu halaman mengirim DELETE `/hello/:id` dan memuat ulang tabel.
6. Pesan singkat muncul di halaman jika nama kosong, ID tidak ditemukan, atau server tidak bisa dihubungi.

## Urutan penjelasan singkat kode web

1. `express.static("public")` menyajikan HTML, CSS, dan JavaScript.
2. HTML berisi form dan tempat baris tabel.
3. `muatNama()` memakai fetch GET, membaca JSON, lalu menambahkan baris.
4. Event submit memakai preventDefault agar halaman tidak berpindah.
5. Form mengirim POST atau PUT melalui JSON.stringify dan header JSON, sesuai mode form.
6. Event delegation pada `tbody` membaca `data-id` untuk tombol Edit dan Hapus.
7. Setelah perubahan berhasil, `muatNama()` mengambil ulang data.

Data tampil menggunakan textContent agar input diperlakukan sebagai teks. Query sapaan `GET /hello?nama=Budi` tetap bekerja seperti pada proyek asli, tetapi halaman ini hanya menampilkan properti data pada response.

Data disimpan dalam array. Refresh browser mempertahankan data; restart server mengembalikan Budi dan Siti. Jika data diubah dari Postman, refresh halaman agar tabel mengambil perubahan terbaru.

## Penerapan AntiSlop

AntiSlop diterapkan dalam mode `during` dari repo `miqdadbadjuber/anti-slop`. Aturan yang dipakai:

- R-01 dan R-29: tidak memakai gradient, neon, atau banyak warna; biru pastel menjadi warna utama dan pink hanya sebagai aksen.
- R-05 dan R-31: halaman hanya berisi bagian yang dibutuhkan untuk tugas, yaitu satu kartu, form, pesan, dan tabel.
- R-25 dan aturan aksesibilitas: teks dibuat gelap di atas latar pastel, kontrol memakai label, dan fokus keyboard terlihat.
- R-03: tabel tetap bisa digeser secara horizontal dan tombol aksi ditumpuk pada layar sempit.
- R-35: fitur GET, POST, PUT, DELETE perlu diuji melalui klik langsung di halaman sebelum dikumpulkan.
- Aturan copy dan komentar: teks antarmuka langsung menjelaskan tindakan, tanpa slogan atau klaim tambahan.

## Perintah ZIP untuk pengumpulan

Jalankan dari folder yang berisi `demo-nama-mahasiswa-web`. Perintah ini mengecualikan `node_modules`, `dist`, `.git`, dan folder AntiSlop sementara:

```bash
zip -r demo-nama-mahasiswa-web.zip demo-nama-mahasiswa-web \
  -x "demo-nama-mahasiswa-web/node_modules/*" \
     "demo-nama-mahasiswa-web/dist/*" \
     "demo-nama-mahasiswa-web/.git/*"
```

Folder AntiSlop berada di `/tmp/anti-slop-saktu`, jadi tidak termasuk di dalam proyek. Pastikan menjalankan perintah dari folder induk proyek agar path ZIP sesuai.

## Urutan screenshot

Simpan screenshot di folder terpisah, bukan di dalam ZIP proyek:

1. `01-get.png`: halaman awal dengan Budi dan Siti terlihat di tabel.
2. `02-post.png`: setelah menambah satu nama lewat form dan pesan sukses tampil.
3. `03-put.png`: satu screenshot saat form mode Edit dan satu setelah perubahan tersimpan.
4. `04-delete.png`: satu screenshot saat konfirmasi hapus dan satu setelah baris hilang.

Untuk setiap screenshot, buka `http://localhost:3000` dan lakukan langkah pada bagian Demo 2. Jika perlu menunjukkan response API, gunakan tabel pada Demo 1 dengan `curl` atau Postman.

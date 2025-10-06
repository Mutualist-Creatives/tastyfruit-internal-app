# Panduan Pengguna - Manajemen Produk TastyFruit

## Selamat Datang! 👋

Panduan ini akan membantu Anda mengelola konten produk buah di sistem CMS TastyFruit. Sistem ini dirancang untuk memudahkan Anda menambah, mengedit, dan mengatur produk serta jenis-jenis buah yang akan ditampilkan di website TastyFruit.

---

## Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Mengelola Produk](#mengelola-produk)
3. [Mengelola Jenis Buah](#mengelola-jenis-buah)
4. [Mengatur Urutan (Drag & Drop)](#mengatur-urutan-drag--drop)
5. [Mencari dan Memfilter](#mencari-dan-memfilter)
6. [Tips dan Trik](#tips-dan-trik)
7. [Troubleshooting](#troubleshooting)

---

## Pengenalan Sistem

### Apa itu Produk?

**Produk** adalah kategori utama buah (misalnya: Apel, Jeruk, Mangga). Setiap produk dapat memiliki beberapa jenis buah di dalamnya.

### Apa itu Jenis Buah?

**Jenis Buah** adalah varietas spesifik dari sebuah produk (misalnya: Apel Fuji, Apel Gala, Apel Granny Smith).

### Struktur Hierarki

```
Produk (Apel)
├── Jenis Buah (Apel Fuji)
├── Jenis Buah (Apel Gala)
└── Jenis Buah (Apel Granny Smith)
```

---

## Mengelola Produk

### Melihat Daftar Produk

1. Buka halaman **Manajemen Produk** dari menu sidebar
2. Anda akan melihat daftar produk dalam format card sections
3. Klik pada section produk untuk membuka/menutup (expand/collapse)

**Informasi yang ditampilkan:**

- Nama produk
- Kategori
- Deskripsi singkat
- Status (Aktif/Nonaktif)
- Jenis-jenis buah (dalam grid cards)

---

### Menambah Produk Baru

#### Langkah-langkah:

1. **Klik tombol "Tambah Produk"** di pojok kanan atas
2. **Isi formulir:**

   - **Nama Produk** (wajib) - Contoh: "Apel Fuji Premium"
   - **Kategori** (wajib) - Pilih dari dropdown (Apel, Jeruk, Mangga, dll.)
   - **Deskripsi** (opsional) - Deskripsi lengkap produk dengan rich text editor
   - **Gambar** (opsional) - URL gambar atau upload file
   - **Status** (toggle) - Aktif/Nonaktif (default: Aktif)

3. **Klik "Preview"** untuk melihat tampilan produk sebelum disimpan (opsional)
4. **Klik "Simpan"** untuk menyimpan produk

**Hasil:**

- Produk baru akan muncul di daftar
- Anda akan diarahkan kembali ke halaman daftar produk
- Notifikasi sukses akan muncul

---

### Mengedit Produk

#### Langkah-langkah:

1. **Cari produk** yang ingin diedit
2. **Klik tombol titik tiga (⋮)** di pojok kanan section produk
3. **Pilih "Edit"** dari menu dropdown
4. **Ubah informasi** yang diperlukan
5. **Klik "Simpan"** untuk menyimpan perubahan

**Tips:**

- Semua field dapat diubah kecuali ID produk
- Perubahan akan langsung terlihat setelah disimpan

---

### Menghapus Produk

#### Langkah-langkah:

1. **Cari produk** yang ingin dihapus
2. **Klik tombol titik tiga (⋮)** di pojok kanan section produk
3. **Pilih "Hapus"** dari menu dropdown
4. **Konfirmasi penghapusan** di dialog yang muncul

**⚠️ PERINGATAN:**

- Menghapus produk akan **menghapus semua jenis buah** yang terkait
- Tindakan ini **tidak dapat dibatalkan**
- Pastikan Anda benar-benar ingin menghapus produk

---

### Mengaktifkan/Menonaktifkan Produk

#### Langkah-langkah:

1. **Cari produk** yang ingin diubah statusnya
2. **Klik tombol titik tiga (⋮)** di pojok kanan section produk
3. **Pilih "Toggle Status"** dari menu dropdown
4. Status akan berubah secara otomatis

**Status:**

- **Aktif** (badge hijau) - Produk ditampilkan di website
- **Nonaktif** (badge abu-abu) - Produk disembunyikan dari website

**Tips:**

- Gunakan fitur ini untuk menyembunyikan produk sementara tanpa menghapusnya
- Produk nonaktif tetap tersimpan di database

---

## Mengelola Jenis Buah

### Melihat Jenis Buah

1. **Buka section produk** dengan mengklik header section
2. Jenis-jenis buah akan ditampilkan dalam **grid cards**
3. Setiap card menampilkan:
   - Foto dominan
   - Nama jenis buah
   - Deskripsi singkat

---

### Menambah Jenis Buah Baru

#### Langkah-langkah:

1. **Buka section produk** yang ingin ditambahkan jenis buahnya
2. **Klik tombol "Tambah Jenis Buah"**
3. **Isi formulir:**

   - **Nama Jenis Buah** (wajib) - Contoh: "Fuji Jepang"
   - **Slug** (otomatis) - URL-friendly identifier (bisa diedit)
   - **Deskripsi** (opsional) - Deskripsi lengkap dengan rich text editor
   - **Gambar** (wajib) - Upload foto jenis buah

4. **Klik "Preview"** untuk melihat tampilan sebelum disimpan (opsional)
5. **Klik "Simpan"** untuk menyimpan jenis buah

**Hasil:**

- Jenis buah baru akan muncul di grid
- Section produk akan otomatis terbuka
- Notifikasi sukses akan muncul

**Tips:**

- Gunakan foto berkualitas tinggi (minimal 800x600px)
- Slug akan otomatis dibuat dari nama (lowercase, dengan tanda hubung)
- Anda bisa mengedit slug jika diperlukan

---

### Melihat Detail Jenis Buah

#### Langkah-langkah:

1. **Klik pada card jenis buah** yang ingin dilihat
2. Modal detail akan muncul menampilkan:
   - Foto besar
   - Nama lengkap
   - Deskripsi lengkap
   - Tombol Edit dan Hapus

**Alternatif:**

- **Hover** pada card jenis buah
- **Klik tombol "Lihat Detail"** dari overlay yang muncul

---

### Mengedit Jenis Buah

#### Cara 1: Dari Modal Detail

1. **Klik card jenis buah** untuk membuka modal detail
2. **Klik tombol "Edit"** di modal
3. **Ubah informasi** yang diperlukan
4. **Klik "Simpan"**

#### Cara 2: Dari Hover Overlay

1. **Hover** pada card jenis buah
2. **Klik tombol "Edit"** dari overlay
3. **Ubah informasi** yang diperlukan
4. **Klik "Simpan"**

---

### Menghapus Jenis Buah

#### Cara 1: Dari Modal Detail

1. **Klik card jenis buah** untuk membuka modal detail
2. **Klik tombol "Hapus"** di modal
3. **Konfirmasi penghapusan** di dialog

#### Cara 2: Dari Hover Overlay

1. **Hover** pada card jenis buah
2. **Klik tombol "Hapus"** dari overlay
3. **Konfirmasi penghapusan** di dialog

**⚠️ PERINGATAN:**

- Tindakan ini **tidak dapat dibatalkan**
- Pastikan Anda benar-benar ingin menghapus jenis buah

---

## Mengatur Urutan (Drag & Drop)

### Mengapa Urutan Penting?

Urutan produk dan jenis buah menentukan bagaimana konten ditampilkan di website TastyFruit. Produk/jenis buah yang berada di urutan atas akan ditampilkan lebih dulu.

---

### Mengatur Urutan Produk

#### Menggunakan Mouse/Trackpad:

1. **Arahkan kursor** ke icon grip (⋮⋮) di sebelah kiri nama produk
2. **Klik dan tahan** icon grip
3. **Drag** produk ke posisi yang diinginkan
4. **Lepaskan** untuk menjatuhkan produk di posisi baru
5. Urutan akan **otomatis tersimpan**

**Visual Feedback:**

- Produk yang sedang di-drag akan menjadi semi-transparan
- Cursor berubah menjadi "grabbing"
- Notifikasi sukses muncul setelah urutan tersimpan

---

### Mengatur Urutan Jenis Buah

#### Menggunakan Mouse/Trackpad:

1. **Buka section produk** yang berisi jenis buah
2. **Arahkan kursor** ke icon grip di pojok card jenis buah
3. **Klik dan tahan** icon grip
4. **Drag** card ke posisi yang diinginkan dalam grid
5. **Lepaskan** untuk menjatuhkan card di posisi baru
6. Urutan akan **otomatis tersimpan**

---

### Menggunakan Keyboard (Aksesibilitas)

#### Untuk Produk:

1. **Tab** ke icon grip produk
2. **Tekan Space** untuk "mengangkat" produk
3. **Gunakan Arrow Keys** (↑↓) untuk memindahkan produk
4. **Tekan Space** lagi untuk "menjatuhkan" produk
5. **Tekan Escape** untuk membatalkan

#### Untuk Jenis Buah:

1. **Tab** ke icon grip jenis buah
2. **Tekan Space** untuk "mengangkat" card
3. **Gunakan Arrow Keys** (↑↓←→) untuk memindahkan card
4. **Tekan Space** lagi untuk "menjatuhkan" card
5. **Tekan Escape** untuk membatalkan

---

### Menggunakan Touch Device (Mobile/Tablet)

1. **Tap dan tahan** icon grip
2. **Drag** dengan jari Anda
3. **Lepaskan** untuk menjatuhkan di posisi baru

**Tips:**

- Pastikan Anda menyentuh icon grip, bukan area lain
- Tahan selama 0.5 detik sebelum mulai drag

---

### Troubleshooting Drag & Drop

**Masalah: Drag tidak berfungsi**

- Pastikan Anda mengklik/menyentuh icon grip (⋮⋮)
- Coba refresh halaman
- Pastikan koneksi internet stabil

**Masalah: Urutan tidak tersimpan**

- Periksa koneksi internet
- Coba lagi setelah beberapa saat
- Jika masalah berlanjut, hubungi administrator

**Masalah: Produk kembali ke posisi semula**

- Ini terjadi jika penyimpanan gagal
- Notifikasi error akan muncul
- Coba lagi atau hubungi administrator

---

## Mencari dan Memfilter

### Mencari Produk

#### Langkah-langkah:

1. **Ketik** kata kunci di kotak pencarian
2. Sistem akan mencari di:
   - Nama produk
   - Deskripsi produk
3. Hasil akan muncul **secara real-time** (saat Anda mengetik)

**Tips:**

- Pencarian tidak case-sensitive (huruf besar/kecil tidak berpengaruh)
- Gunakan kata kunci spesifik untuk hasil lebih akurat

---

### Memfilter Produk

#### Filter Berdasarkan Kategori:

1. **Klik dropdown "Kategori"**
2. **Pilih kategori** yang diinginkan (Apel, Jeruk, Mangga, dll.)
3. Hanya produk dengan kategori tersebut yang akan ditampilkan

#### Filter Berdasarkan Status:

1. **Klik dropdown "Status"**
2. **Pilih status** yang diinginkan:
   - **Aktif** - Hanya produk aktif
   - **Nonaktif** - Hanya produk nonaktif
   - **Semua** - Semua produk

---

### Menghapus Filter

**Cara 1: Tombol Clear Filters**

- Klik tombol **"Clear Filters"** untuk menghapus semua filter sekaligus

**Cara 2: Manual**

- Hapus teks di kotak pencarian
- Pilih "Semua" di dropdown kategori dan status

---

### Pagination

Jika produk lebih dari 10 item, sistem akan membagi menjadi beberapa halaman.

**Navigasi:**

- **Tombol "< Prev"** - Ke halaman sebelumnya
- **Nomor halaman** - Langsung ke halaman tertentu
- **Tombol "Next >"** - Ke halaman berikutnya

**Informasi:**

- Jumlah total produk ditampilkan di bawah
- Halaman aktif ditandai dengan warna berbeda

---

## Tips dan Trik

### 1. Menggunakan Rich Text Editor

**Fitur yang tersedia:**

- **Bold** - Tekan Ctrl+B (Windows) atau Cmd+B (Mac)
- **Italic** - Tekan Ctrl+I atau Cmd+I
- **Heading** - Pilih dari dropdown
- **List** - Bullet atau numbered list
- **Link** - Tambahkan hyperlink

**Tips:**

- Gunakan heading untuk struktur yang jelas
- Jangan terlalu banyak formatting
- Preview sebelum menyimpan

---

### 2. Optimasi Gambar

**Rekomendasi:**

- **Format:** JPG atau PNG
- **Ukuran file:** Maksimal 2MB
- **Dimensi:** Minimal 800x600px
- **Aspect ratio:** 4:3 atau 1:1 untuk jenis buah

**Cara upload:**

- Klik area upload
- Pilih file dari komputer
- Tunggu hingga upload selesai
- Preview akan muncul

---

### 3. Workflow Efisien

**Untuk menambah produk baru dengan jenis buah:**

1. Tambah produk terlebih dahulu
2. Simpan produk
3. Dari halaman daftar, buka section produk yang baru dibuat
4. Klik "Tambah Jenis Buah"
5. Tambahkan semua jenis buah satu per satu
6. Atur urutan jenis buah dengan drag & drop

---

### 4. Keyboard Shortcuts

| Shortcut | Aksi                        |
| -------- | --------------------------- |
| Tab      | Navigasi antar elemen       |
| Enter    | Aktivasi tombol/link        |
| Space    | Toggle checkbox/switch      |
| Escape   | Tutup modal/dialog          |
| Ctrl+S   | Simpan form (jika didukung) |

---

### 5. Mobile Tips

**Untuk pengguna mobile:**

- Gunakan mode landscape untuk tampilan lebih luas
- Zoom in jika teks terlalu kecil
- Gunakan tap-and-hold untuk drag & drop
- Scroll horizontal untuk melihat semua card

---

## Troubleshooting

### Masalah Umum dan Solusi

#### 1. Gambar tidak muncul

**Penyebab:**

- URL gambar tidak valid
- File terlalu besar
- Format tidak didukung

**Solusi:**

- Periksa URL gambar
- Kompres gambar (maksimal 2MB)
- Gunakan format JPG atau PNG

---

#### 2. Form tidak bisa disimpan

**Penyebab:**

- Field wajib belum diisi
- Validasi gagal
- Koneksi internet terputus

**Solusi:**

- Periksa field yang ditandai merah
- Perbaiki error validasi
- Periksa koneksi internet
- Coba lagi setelah beberapa saat

---

#### 3. Produk tidak muncul di daftar

**Penyebab:**

- Filter aktif
- Produk di halaman lain
- Produk baru saja dihapus

**Solusi:**

- Klik "Clear Filters"
- Cek halaman lain (pagination)
- Refresh halaman

---

#### 4. Drag & drop tidak berfungsi

**Penyebab:**

- Browser tidak didukung
- JavaScript dinonaktifkan
- Koneksi internet lambat

**Solusi:**

- Gunakan browser modern (Chrome, Firefox, Safari, Edge)
- Aktifkan JavaScript
- Periksa koneksi internet
- Coba gunakan keyboard navigation

---

#### 5. Perubahan tidak tersimpan

**Penyebab:**

- Koneksi internet terputus
- Server error
- Session expired

**Solusi:**

- Periksa koneksi internet
- Refresh halaman dan coba lagi
- Login ulang jika diperlukan
- Hubungi administrator jika masalah berlanjut

---

### Pesan Error Umum

#### "Validation failed"

- **Artinya:** Data yang diinput tidak valid
- **Solusi:** Periksa field yang ditandai merah dan perbaiki

#### "Failed to fetch"

- **Artinya:** Gagal mengambil data dari server
- **Solusi:** Periksa koneksi internet dan refresh halaman

#### "Unauthorized"

- **Artinya:** Session Anda expired
- **Solusi:** Login ulang

#### "Product not found"

- **Artinya:** Produk yang dicari tidak ditemukan
- **Solusi:** Produk mungkin sudah dihapus, refresh halaman

---

## Bantuan Lebih Lanjut

### Kontak Support

Jika Anda mengalami masalah yang tidak tercantum di panduan ini:

1. **Email:** support@tastyfruit.com
2. **Phone:** +62 xxx-xxxx-xxxx
3. **Live Chat:** Klik icon chat di pojok kanan bawah

### Dokumentasi Teknis

Untuk developer atau administrator:

- API Documentation: `API_DOCUMENTATION.md`
- Technical Guide: `DRAG_AND_DROP_IMPLEMENTATION.md`
- Cleanup Summary: `CLEANUP_SUMMARY.md`

---

## Changelog

### Versi 2.0 (Current)

**Fitur Baru:**

- ✅ Card-based layout (menggantikan table)
- ✅ Drag & drop untuk reordering
- ✅ Collapsible sections
- ✅ Hover overlay untuk jenis buah
- ✅ Modal detail jenis buah
- ✅ Toggle status produk
- ✅ Improved search dan filter
- ✅ Responsive design

**Perubahan:**

- ❌ Field harga dihapus (bukan e-commerce)
- ❌ Field stok dihapus (bukan e-commerce)
- ❌ Field SKU dihapus (bukan e-commerce)

**Perbaikan:**

- 🐛 Loading states lebih baik
- 🐛 Error handling lebih informatif
- 🐛 Accessibility improvements
- 🐛 Mobile experience lebih baik

---

## Kesimpulan

Selamat! Anda sekarang sudah memahami cara menggunakan sistem Manajemen Produk TastyFruit. Sistem ini dirancang untuk memudahkan Anda mengelola konten produk buah dengan cara yang intuitif dan efisien.

**Ingat:**

- Gunakan drag & drop untuk mengatur urutan
- Preview sebelum menyimpan
- Gunakan filter untuk menemukan produk dengan cepat
- Jangan ragu untuk menghubungi support jika ada masalah

**Selamat mengelola konten! 🍎🍊🥭**

# Requirements Document

## Introduction

Fitur Manajemen Produk adalah sistem CMS (Content Management System) untuk mengelola konten produk buah yang akan ditampilkan di web client TastyFruit. Sistem ini memungkinkan admin untuk mengelola produk buah dan jenis-jenis buah dalam setiap produk dengan antarmuka visual yang intuitif berbasis card.

**Konteks Penting:**

- Ini adalah CMS untuk konten, BUKAN sistem e-commerce
- Tidak ada transaksi, harga, atau stok
- Fokus pada manajemen konten visual untuk web client
- Struktur hierarki: Produk (kategori buah) → Jenis Buah (varietas spesifik)

## Requirements

### Requirement 1: Halaman List Produk dengan Card-Based Layout

**User Story:** Sebagai admin, saya ingin melihat semua produk buah dalam format card sections yang visual, sehingga saya dapat dengan mudah mengelola konten produk dan jenis buah secara hierarkis.

#### Acceptance Criteria

1. WHEN admin membuka halaman `/produk` THEN sistem SHALL menampilkan daftar produk dalam format section cards
2. WHEN produk ditampilkan THEN setiap produk SHALL memiliki section tersendiri yang menampilkan:
   - Nama produk (kategori buah)
   - Deskripsi singkat produk
   - Status aktif/nonaktif
   - Tombol aksi (Edit, Delete, Toggle Status)
   - Tombol "Tambah Jenis Buah"
   - Grid cards untuk jenis-jenis buah yang terkait
3. WHEN halaman pertama kali dimuat THEN hanya section produk pertama SHALL terbuka (expanded), section lainnya collapsed
4. WHEN admin mengklik section produk yang collapsed THEN section tersebut SHALL expand dan menampilkan jenis-jenis buah
5. WHEN tidak ada produk THEN sistem SHALL menampilkan empty state dengan ilustrasi dan tombol "Tambah Produk Pertama"
6. WHEN produk memiliki jenis buah THEN jenis buah SHALL ditampilkan dalam grid cards dengan:
   - Foto dominan (aspect ratio 4:3 atau 1:1)
   - Nama jenis buah
   - Deskripsi singkat (truncated)
   - Hover effect (opacity/overlay)
7. WHEN admin menghover card jenis buah THEN card SHALL menampilkan overlay dengan tombol aksi (View Detail, Edit, Delete)

### Requirement 2: Search dan Filter Produk

**User Story:** Sebagai admin, saya ingin mencari dan memfilter produk berdasarkan kriteria tertentu, sehingga saya dapat menemukan produk yang ingin saya kelola dengan cepat.

#### Acceptance Criteria

1. WHEN admin mengetik di search box THEN sistem SHALL melakukan real-time search berdasarkan nama produk
2. WHEN admin memilih filter kategori THEN sistem SHALL menampilkan hanya produk dengan kategori tersebut
3. WHEN admin memilih filter status THEN sistem SHALL menampilkan hanya produk dengan status aktif atau nonaktif
4. WHEN admin mengklik "Clear Filters" THEN semua filter SHALL direset dan menampilkan semua produk
5. WHEN search atau filter diterapkan THEN pagination SHALL reset ke halaman pertama
6. WHEN tidak ada hasil search/filter THEN sistem SHALL menampilkan empty state "Tidak ada produk yang ditemukan"

### Requirement 3: Drag and Drop untuk Reordering

**User Story:** Sebagai admin, saya ingin mengatur urutan tampilan produk dan jenis buah dengan drag and drop, sehingga saya dapat mengontrol urutan konten yang ditampilkan di web client.

#### Acceptance Criteria

1. WHEN admin menghover section produk THEN cursor SHALL berubah menjadi grab cursor dan menampilkan drag handle
2. WHEN admin drag section produk THEN section SHALL dapat dipindahkan ke posisi lain
3. WHEN admin drop section produk THEN urutan baru SHALL tersimpan ke database
4. WHEN admin drag card jenis buah THEN card SHALL dapat dipindahkan ke posisi lain dalam grid
5. WHEN admin drop card jenis buah THEN urutan baru SHALL tersimpan ke database
6. WHEN reordering gagal THEN sistem SHALL menampilkan toast error dan mengembalikan ke posisi semula
7. WHEN reordering berhasil THEN sistem SHALL menampilkan toast success "Urutan berhasil diperbarui"

### Requirement 4: CRUD Produk (Tanpa Harga & Stok)

**User Story:** Sebagai admin, saya ingin menambah, mengedit, dan menghapus produk buah, sehingga saya dapat mengelola konten produk yang ditampilkan di web client.

#### Acceptance Criteria

1. WHEN admin mengklik "Tambah Produk" THEN sistem SHALL mengarahkan ke halaman `/produk/tambah`
2. WHEN admin di halaman tambah produk THEN form SHALL menampilkan field:
   - Nama Produk (required)
   - Kategori (dropdown: nama-nama buah, required)
   - Deskripsi (rich text editor, optional)
   - Upload Gambar atau URL Gambar (optional)
   - Status Aktif (toggle, default: true)
3. WHEN admin mengisi form dan klik "Simpan" THEN sistem SHALL:
   - Validasi semua field required
   - Upload gambar jika ada file dipilih
   - Simpan data produk ke database
   - Redirect ke halaman `/produk` dengan toast success
4. WHEN admin mengklik tombol Edit pada produk THEN sistem SHALL mengarahkan ke `/produk/edit/[id]` dengan form pre-filled
5. WHEN admin mengklik tombol Delete pada produk THEN sistem SHALL:
   - Menampilkan dialog konfirmasi dengan peringatan "Produk dan semua jenis buahnya akan dihapus"
   - Jika dikonfirmasi, hapus produk dan cascade delete semua jenis buah terkait
   - Menampilkan toast success "Produk berhasil dihapus"
6. WHEN admin mengklik toggle status THEN sistem SHALL:
   - Update status produk (aktif/nonaktif)
   - Menampilkan toast success
   - Update tampilan badge status tanpa reload halaman
7. WHEN admin mengklik "Preview" di form THEN sistem SHALL menampilkan modal preview produk

### Requirement 5: CRUD Jenis Buah

**User Story:** Sebagai admin, saya ingin menambah, mengedit, dan menghapus jenis buah dalam setiap produk, sehingga saya dapat mengelola varietas buah yang ditampilkan di web client.

#### Acceptance Criteria

1. WHEN admin mengklik "Tambah Jenis Buah" di section produk THEN sistem SHALL mengarahkan ke `/produk/[productId]/jenis-buah/tambah`
2. WHEN admin di halaman tambah jenis buah THEN form SHALL menampilkan field:
   - Nama Jenis Buah (required)
   - Slug (auto-generated dari nama, editable)
   - Deskripsi (rich text editor, optional)
   - Upload Gambar (required)
3. WHEN admin mengisi form dan klik "Simpan" THEN sistem SHALL:
   - Validasi semua field required
   - Upload gambar
   - Simpan data jenis buah ke database dengan relasi ke produk
   - Redirect ke halaman `/produk` dengan section produk terkait expanded
   - Menampilkan toast success
4. WHEN admin mengklik card jenis buah THEN sistem SHALL menampilkan modal detail dengan:
   - Foto besar
   - Nama jenis buah
   - Deskripsi lengkap
   - Tombol Edit dan Delete
5. WHEN admin mengklik Edit di modal detail THEN sistem SHALL mengarahkan ke `/produk/[productId]/jenis-buah/edit/[id]`
6. WHEN admin mengklik Delete di modal detail THEN sistem SHALL:
   - Menampilkan dialog konfirmasi
   - Jika dikonfirmasi, hapus jenis buah
   - Close modal dan update tampilan section produk
   - Menampilkan toast success
7. WHEN admin mengklik "Preview" di form THEN sistem SHALL menampilkan modal preview jenis buah

### Requirement 6: Responsive Design dan Mobile Support

**User Story:** Sebagai admin yang menggunakan mobile device, saya ingin dapat melakukan semua operasi CRUD dengan nyaman, sehingga saya dapat mengelola konten dari mana saja.

#### Acceptance Criteria

1. WHEN halaman dibuka di mobile (< 768px) THEN layout SHALL menyesuaikan menjadi single column
2. WHEN di mobile THEN grid cards jenis buah SHALL menjadi 1-2 kolom (tergantung lebar layar)
3. WHEN di tablet (768px - 1024px) THEN grid cards SHALL menjadi 2-3 kolom
4. WHEN di desktop (> 1024px) THEN grid cards SHALL menjadi 3-4 kolom
5. WHEN di mobile THEN semua form fields SHALL tetap accessible dan mudah diisi
6. WHEN di mobile THEN drag and drop SHALL tetap berfungsi dengan touch gestures
7. WHEN di mobile THEN action buttons SHALL cukup besar untuk di-tap (min 44x44px)

### Requirement 7: Error Handling dan Loading States

**User Story:** Sebagai admin, saya ingin mendapat feedback yang jelas saat sistem sedang memproses atau terjadi error, sehingga saya tahu status operasi yang sedang berjalan.

#### Acceptance Criteria

1. WHEN data sedang dimuat THEN sistem SHALL menampilkan skeleton loading yang sesuai dengan layout
2. WHEN operasi CRUD sedang diproses THEN tombol submit SHALL disabled dengan loading indicator
3. WHEN terjadi error saat fetch data THEN sistem SHALL menampilkan error state dengan tombol "Coba Lagi"
4. WHEN terjadi error saat submit form THEN sistem SHALL menampilkan error message di atas form
5. WHEN operasi berhasil THEN sistem SHALL menampilkan toast notification success
6. WHEN operasi gagal THEN sistem SHALL menampilkan toast notification error dengan pesan yang jelas
7. WHEN upload gambar gagal THEN sistem SHALL menampilkan error message spesifik (ukuran terlalu besar, format tidak didukung, dll)

### Requirement 8: Design System Consistency

**User Story:** Sebagai developer dan designer, saya ingin semua komponen menggunakan shadcn/ui design system, sehingga tampilan konsisten dan maintainable.

#### Acceptance Criteria

1. WHEN komponen button digunakan THEN SHALL menggunakan `Button` component dari shadcn/ui
2. WHEN komponen card digunakan THEN SHALL menggunakan `Card` component dari shadcn/ui
3. WHEN komponen badge digunakan THEN SHALL menggunakan `Badge` component dari shadcn/ui
4. WHEN dialog/modal digunakan THEN SHALL menggunakan `Dialog` component dari shadcn/ui
5. WHEN form input digunakan THEN SHALL menggunakan `Input`, `Select`, `Textarea` dari shadcn/ui
6. WHEN dropdown menu digunakan THEN SHALL menggunakan `DropdownMenu` component dari shadcn/ui
7. WHEN collapsible section digunakan THEN SHALL menggunakan `Collapsible` component dari shadcn/ui
8. WHEN warna digunakan THEN SHALL menggunakan CSS variables dari design system (--primary, --secondary, dll)

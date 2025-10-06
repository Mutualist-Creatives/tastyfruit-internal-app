# Requirements Document

## Introduction

Dashboard adalah halaman utama admin panel TastyFruit yang memberikan overview lengkap tentang konten CMS, aktivitas terbaru, dan analytics pengunjung web client. Dashboard ini dirancang untuk memberikan insights yang actionable dan quick access ke fungsi-fungsi penting.

**Konteks Penting:**

- Ini adalah CMS dashboard, bukan e-commerce dashboard
- Fokus pada content management dan web client analytics
- Tidak ada metrics terkait transaksi, penjualan, atau stok
- Real-time updates dengan pertimbangan performance

## Requirements

### Requirement 1: Metrics Cards Overview

**User Story:** Sebagai admin, saya ingin melihat metrics utama konten dalam bentuk cards yang jelas, sehingga saya dapat dengan cepat memahami status konten CMS.

#### Acceptance Criteria

1. WHEN admin membuka dashboard THEN sistem SHALL menampilkan 3 metric cards utama:
   - Total Konten (sum of all content types)
   - Konten Aktif (published content)
   - Konten Minggu Ini (content created in last 7 days)
2. WHEN metric card ditampilkan THEN setiap card SHALL menampilkan:
   - Icon yang relevan
   - Judul metric
   - Nilai numeric yang besar dan jelas
   - Subtitle dengan breakdown atau context
   - Trend indicator (naik/turun vs periode sebelumnya)
3. WHEN data metric berubah THEN card SHALL update secara real-time (dengan auto-refresh)
4. WHEN admin menghover metric card THEN card SHALL menampilkan tooltip dengan detail breakdown
5. WHEN metric card diklik THEN sistem SHALL menampilkan detail modal atau navigate ke halaman terkait

### Requirement 2: Web Client Analytics Chart

**User Story:** Sebagai admin, saya ingin melihat trend pengunjung web client dalam bentuk line chart, sehingga saya dapat memahami performa konten yang dipublikasikan.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan line chart untuk visitor analytics
2. WHEN chart ditampilkan THEN chart SHALL menampilkan:
   - Data pengunjung harian dalam periode yang dipilih
   - Line smooth dengan gradient fill
   - Tooltip saat hover menampilkan tanggal dan jumlah visitor
   - Legend yang jelas
3. WHEN admin memilih date range filter THEN chart SHALL update dengan data periode tersebut
4. WHEN tidak ada data analytics THEN chart SHALL menampilkan empty state dengan pesan informatif
5. WHEN data analytics loading THEN chart SHALL menampilkan skeleton loader
6. WHEN chart di-hover THEN sistem SHALL menampilkan detail visitor count untuk tanggal tersebut

### Requirement 3: Content Publish Status Chart

**User Story:** Sebagai admin, saya ingin melihat distribusi status konten (published vs draft) dalam bentuk bar chart, sehingga saya dapat mengetahui berapa banyak konten yang perlu di-review atau dipublikasikan.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan bar chart untuk publish status
2. WHEN chart ditampilkan THEN chart SHALL menampilkan:
   - Bar untuk Published content (hijau)
   - Bar untuk Draft content (kuning/orange)
   - Breakdown per content type (Produk, Resep, Publikasi)
   - Total count di atas setiap bar
3. WHEN admin mengklik bar THEN sistem SHALL navigate ke halaman list dengan filter status tersebut
4. WHEN admin menghover bar THEN tooltip SHALL menampilkan detail count per content type
5. WHEN date range filter diterapkan THEN chart SHALL update sesuai periode

### Requirement 4: Recent Content Widget

**User Story:** Sebagai admin, saya ingin melihat 5 konten terbaru dengan quick actions, sehingga saya dapat dengan cepat mengelola konten yang baru dibuat atau diupdate.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan widget "Konten Terbaru" dengan 5 konten terakhir
2. WHEN konten ditampilkan THEN setiap item SHALL menampilkan:
   - Thumbnail/image (fallback icon jika tidak ada gambar)
   - Judul konten
   - Content type badge (Produk/Resep/Publikasi)
   - Status badge (Published/Draft)
   - Last modified date (relative time: "2 jam yang lalu")
   - Quick action buttons (Edit, View, Delete)
3. WHEN admin mengklik thumbnail atau judul THEN sistem SHALL membuka detail/preview konten
4. WHEN admin mengklik Edit THEN sistem SHALL navigate ke edit page
5. WHEN admin mengklik Delete THEN sistem SHALL menampilkan confirm dialog
6. WHEN admin mengklik "Lihat Semua" THEN sistem SHALL navigate ke halaman all content
7. WHEN tidak ada konten THEN widget SHALL menampilkan empty state dengan CTA "Buat Konten Pertama"

### Requirement 5: Quick Actions Widget

**User Story:** Sebagai admin, saya ingin memiliki shortcut buttons untuk membuat konten baru, sehingga saya dapat dengan cepat menambah konten tanpa navigasi melalui sidebar.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan widget "Quick Actions"
2. WHEN widget ditampilkan THEN SHALL menampilkan 3 action buttons:
   - Tambah Produk (icon Package, warna primary)
   - Tambah Resep (icon CookingPot, warna secondary)
   - Tambah Publikasi (icon FileText, warna accent)
3. WHEN admin mengklik action button THEN sistem SHALL navigate ke halaman tambah konten tersebut
4. WHEN button di-hover THEN SHALL menampilkan hover effect (scale, shadow)
5. WHEN di mobile THEN buttons SHALL stack vertically atau dalam grid 2 kolom

### Requirement 6: Content by Category Widget

**User Story:** Sebagai admin, saya ingin melihat distribusi konten per kategori buah, sehingga saya dapat memahami kategori mana yang paling banyak atau kurang konten.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan widget "Konten per Kategori"
2. WHEN widget ditampilkan THEN SHALL menampilkan grid cards untuk setiap kategori buah
3. WHEN category card ditampilkan THEN SHALL menampilkan:
   - Nama kategori (Apel, Jeruk, Mangga, dll)
   - Total count konten dalam kategori
   - Icon atau emoji buah
   - Progress bar atau visual indicator
4. WHEN admin mengklik category card THEN sistem SHALL navigate ke halaman produk dengan filter kategori tersebut
5. WHEN category card di-hover THEN SHALL menampilkan hover effect
6. WHEN tidak ada konten dalam kategori THEN card SHALL menampilkan "0" dengan styling berbeda

### Requirement 7: Activity Timeline Widget

**User Story:** Sebagai admin, saya ingin melihat timeline aktivitas terbaru (create, update, delete), sehingga saya dapat tracking perubahan yang terjadi di CMS.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan widget "Activity Timeline"
2. WHEN timeline ditampilkan THEN SHALL menampilkan 10 aktivitas terakhir dengan:
   - Icon sesuai action type (create: plus, update: edit, delete: trash)
   - Deskripsi aktivitas ("Produk 'Apel Fuji' dibuat")
   - User yang melakukan (jika ada multi-user)
   - Timestamp (relative time)
   - Color coding (create: green, update: blue, delete: red)
3. WHEN admin mengklik activity item THEN sistem SHALL navigate ke konten terkait (jika masih ada)
4. WHEN admin scroll ke bawah timeline THEN sistem SHALL lazy load more activities
5. WHEN tidak ada aktivitas THEN timeline SHALL menampilkan empty state
6. WHEN activity adalah delete THEN item SHALL menampilkan strikethrough dan tidak clickable

### Requirement 8: Date Range Filter

**User Story:** Sebagai admin, saya ingin memfilter data dashboard berdasarkan periode waktu, sehingga saya dapat melihat metrics dan charts untuk periode spesifik.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan date range filter di header
2. WHEN filter ditampilkan THEN SHALL menyediakan preset options:
   - 7 Hari Terakhir (default)
   - 30 Hari Terakhir
   - 3 Bulan Terakhir
   - Custom Range (date picker)
3. WHEN admin memilih preset THEN semua charts dan metrics SHALL update sesuai periode
4. WHEN admin memilih custom range THEN sistem SHALL menampilkan date picker
5. WHEN date range berubah THEN sistem SHALL:
   - Show loading state pada affected components
   - Fetch new data dari API
   - Update semua charts dan metrics
   - Save preference ke localStorage
6. WHEN date range invalid (start > end) THEN sistem SHALL menampilkan error message
7. WHEN page reload THEN sistem SHALL restore last selected date range dari localStorage

### Requirement 9: Auto-Refresh dengan Performance Optimization

**User Story:** Sebagai admin, saya ingin dashboard auto-refresh untuk menampilkan data terbaru, namun tetap mempertimbangkan performance agar tidak membebani sistem.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL setup auto-refresh dengan interval 5 menit
2. WHEN auto-refresh triggered THEN sistem SHALL:
   - Fetch only changed data (tidak reload semua)
   - Update metrics cards secara incremental
   - Update charts hanya jika ada perubahan data
   - Tidak interrupt user interaction (jika user sedang hover/click)
3. WHEN user inactive (tidak ada interaction) selama 10 menit THEN auto-refresh SHALL pause
4. WHEN user kembali active THEN auto-refresh SHALL resume dan fetch latest data
5. WHEN network error terjadi THEN auto-refresh SHALL retry dengan exponential backoff
6. WHEN admin mengklik manual refresh button THEN sistem SHALL force refresh semua data
7. WHEN auto-refresh running THEN sistem SHALL menampilkan subtle indicator (pulsing dot atau "Last updated: X ago")

### Requirement 10: Search dari Dashboard

**User Story:** Sebagai admin, saya ingin melakukan quick search konten langsung dari dashboard, sehingga saya dapat dengan cepat menemukan konten tanpa navigasi ke halaman list.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan search bar di header
2. WHEN admin mengetik di search bar THEN sistem SHALL:
   - Debounce input (300ms)
   - Search across all content types (Produk, Resep, Publikasi)
   - Menampilkan dropdown results dengan max 10 items
3. WHEN search results ditampilkan THEN setiap item SHALL menampilkan:
   - Thumbnail
   - Judul (dengan highlight search term)
   - Content type badge
   - Quick action (View, Edit)
4. WHEN admin mengklik search result THEN sistem SHALL navigate ke detail/edit page
5. WHEN admin tekan Enter THEN sistem SHALL navigate ke halaman search results lengkap
6. WHEN tidak ada hasil THEN dropdown SHALL menampilkan "Tidak ada hasil" dengan suggestion
7. WHEN search bar di-focus THEN SHALL menampilkan recent searches (max 5)

### Requirement 11: Export Data Functionality

**User Story:** Sebagai admin, saya ingin export data dashboard dalam format CSV atau PDF, sehingga saya dapat membuat report atau analisis offline.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN sistem SHALL menampilkan export button di header
2. WHEN admin mengklik export button THEN sistem SHALL menampilkan dropdown dengan options:
   - Export as CSV
   - Export as PDF
   - Export as Excel (optional)
3. WHEN admin memilih export format THEN sistem SHALL:
   - Show loading indicator
   - Generate file dengan data sesuai current date range filter
   - Include all metrics, charts data, dan recent content
   - Auto-download file dengan nama "TastyFruit*Dashboard*[date].csv"
4. WHEN export berhasil THEN sistem SHALL menampilkan success toast
5. WHEN export gagal THEN sistem SHALL menampilkan error toast dengan retry option
6. WHEN export PDF THEN file SHALL include:
   - Header dengan logo dan date range
   - All metrics cards
   - Charts as images
   - Recent content table
   - Footer dengan generated timestamp

### Requirement 12: Responsive Design dan Mobile Optimization

**User Story:** Sebagai admin yang menggunakan mobile device, saya ingin dashboard tetap usable dan informatif, sehingga saya dapat monitoring konten dari mana saja.

#### Acceptance Criteria

1. WHEN dashboard dibuka di mobile (< 768px) THEN layout SHALL:
   - Stack semua widgets vertically
   - Metric cards dalam 1 kolom
   - Charts full width dengan scrollable x-axis jika perlu
   - Quick actions dalam 2 kolom grid
2. WHEN di tablet (768px - 1024px) THEN layout SHALL:
   - Metric cards dalam 2 kolom
   - Charts dalam 1 kolom
   - Widgets dalam 2 kolom grid
3. WHEN di desktop (> 1024px) THEN layout SHALL:
   - Metric cards dalam 3 kolom
   - Charts side by side (7-5 grid)
   - Widgets dalam optimal grid layout
4. WHEN di mobile THEN search bar SHALL collapse menjadi icon button
5. WHEN di mobile THEN date range filter SHALL use native date picker
6. WHEN di mobile THEN export button SHALL show simplified menu
7. WHEN di mobile THEN charts SHALL be touch-friendly dengan pinch-to-zoom

### Requirement 13: Loading States dan Error Handling

**User Story:** Sebagai admin, saya ingin mendapat feedback yang jelas saat data loading atau terjadi error, sehingga saya tahu status sistem.

#### Acceptance Criteria

1. WHEN dashboard pertama kali dimuat THEN sistem SHALL menampilkan skeleton loading untuk semua widgets
2. WHEN individual widget loading THEN widget SHALL menampilkan skeleton sesuai struktur widget
3. WHEN fetch data gagal THEN widget SHALL menampilkan error state dengan:
   - Error icon
   - Error message yang jelas
   - Retry button
   - Suggestion (check connection, contact support)
4. WHEN retry berhasil THEN error state SHALL diganti dengan data
5. WHEN partial data available THEN sistem SHALL menampilkan available data dan error state untuk yang gagal
6. WHEN auto-refresh gagal THEN sistem SHALL:
   - Tidak mengganggu UI yang sudah ada
   - Menampilkan subtle error indicator
   - Retry otomatis dengan backoff
7. WHEN network offline THEN sistem SHALL menampilkan offline banner di top

### Requirement 14: Performance Optimization

**User Story:** Sebagai admin, saya ingin dashboard load dengan cepat dan smooth, sehingga saya dapat bekerja dengan efisien.

#### Acceptance Criteria

1. WHEN dashboard dimuat THEN initial load SHALL complete dalam < 2 detik
2. WHEN data fetching THEN sistem SHALL:
   - Use parallel requests untuk independent data
   - Cache responses dengan appropriate TTL
   - Use pagination untuk large datasets (activity timeline)
3. WHEN charts rendering THEN sistem SHALL:
   - Use virtualization untuk large datasets
   - Debounce resize events
   - Use requestAnimationFrame untuk smooth animations
4. WHEN auto-refresh THEN sistem SHALL:
   - Only fetch changed data (incremental updates)
   - Use WebSocket atau Server-Sent Events jika available
   - Batch multiple updates
5. WHEN images loading THEN sistem SHALL:
   - Use lazy loading untuk below-fold images
   - Use optimized image formats (WebP with fallback)
   - Show placeholder while loading
6. WHEN user scrolling THEN sistem SHALL:
   - Use intersection observer untuk lazy load widgets
   - Throttle scroll events
   - Unload off-screen heavy components

### Requirement 15: Accessibility

**User Story:** Sebagai admin dengan disabilities, saya ingin dashboard accessible dengan screen reader dan keyboard navigation, sehingga saya dapat menggunakan dashboard dengan mudah.

#### Acceptance Criteria

1. WHEN menggunakan keyboard THEN admin SHALL dapat:
   - Tab through all interactive elements
   - Activate buttons dengan Enter/Space
   - Navigate charts dengan arrow keys
   - Close modals dengan Escape
2. WHEN menggunakan screen reader THEN sistem SHALL:
   - Announce page title dan main sections
   - Provide ARIA labels untuk icon buttons
   - Announce dynamic updates (new content, errors)
   - Provide alternative text untuk charts
3. WHEN focus pada element THEN SHALL menampilkan visible focus indicator
4. WHEN color digunakan THEN SHALL tidak rely on color alone (use icons, text)
5. WHEN contrast checked THEN SHALL meet WCAG AA standards (4.5:1)
6. WHEN charts displayed THEN SHALL provide data table alternative
7. WHEN animations running THEN SHALL respect prefers-reduced-motion

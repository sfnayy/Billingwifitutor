# Product Requirements Document (PRD)
## Web App Billing WiFi - Project Antigravity

---

### 1. Ringkasan Eksekutif (Executive Summary)
Dokumen ini mendefinisikan spesifikasi produk dan alur kerja (roadmap) untuk pengembangan aplikasi web manajemen penagihan (billing) layanan internet WiFi. Aplikasi ini dirancang dengan antarmuka yang **simple dan modern** untuk memudahkan dua sisi pengguna: **Admin** (penyedia layanan) dalam mengelola pelanggan dan menerbitkan tagihan, serta **User** (pelanggan) untuk memantau status paket dan riwayat tagihan mereka.

---

### 2. Tech Stack & Arsitektur
Pilihan teknologi difokuskan pada skalabilitas, kecepatan pengembangan, dan performa UI yang modern:
* **Frontend & Framework:** React.js dengan Next.js (App Router)
* **Backend:** Next.js API Routes (Serverless functions) untuk logika bisnis
* **Database & Layanan:** Firebase (Firestore NoSQL, Firebase Authentication, dan Firebase Hosting)
* **Styling:** Tailwind CSS (Tema Warna: Modern Blue)

---

### 3. Fase Pengembangan (Development Roadmap)

#### Fase 1: Landing Page (Fokus Visual & Pemasaran)
Fase ini berfokus pada halaman statis yang dapat diakses publik dengan estitika modern dan bersih.
* **Hero Section:** Headline utama yang menarik dengan CTA (*Call to Action*) jelas berupa tombol "Login Pelanggan" atau "Cek Paket".
* **Pricing/Paket Internet:** Daftar paket internet yang tersedia (misal: 20 Mbps, 50 Mbps) dengan visual kartu (*card*) yang modern beserta detail harga.
* **Fitur & Keunggulan:** Menyoroti stabilitas jaringan, kecepatan, dan dukungan teknis 24/7.
* **Footer:** Informasi kontak, lokasi, dan hak cipta Project Antigravity.

#### Fase 2: Frontend Development (UI/UX Aplikasi)
Mengembangkan antarmuka halaman dashboard menggunakan *dummy data* sebelum dihubungkan ke database.

**A. Portal Pelanggan (User):**
* **Halaman Login:** Form simpel berbasis email dan password.
* **Dashboard User:** Menampilkan status paket (Aktif/Isolir), kecepatan bandwidth, dan tanggal jatuh tempo pembayaran berikutnya.
* **Riwayat Tagihan:** Komponen tabel (*Table UI*) yang menampilkan daftar tagihan bulan sebelumnya beserta label status berwarna (Lunas/Belum Bayar).

**B. Portal Admin:**
* **Dashboard Admin:** Ringkasan berupa metrik total pendapatan bulan ini, jumlah pelanggan aktif, dan jumlah tagihan yang belum terbayar.
* **Manajemen Pelanggan (CRUD):** Halaman manajemen untuk menambah, melihat, mengedit, dan menghapus data pelanggan.
* **Manajemen Tagihan:** Halaman untuk membuat invoice bulanan secara manual atau memantau status pembayaran pelanggan.

#### Fase 3: Backend & Firebase Integration (Logika & Data)
Fase untuk menghidupkan fungsi aplikasi dengan menghubungkannya ke layanan Firebase.
* **Autentikasi (Firebase Auth):** Integrasi sistem login dan pembatasan hak akses (*Role-Based Access Control* / RBAC) agar user biasa tidak bisa mengakses halaman `/admin`.
* **Setup Firestore:** Menghubungkan komponen UI ke database Firestore asli.
* **API Routes (Next.js):** Membuat fungsi backend untuk otomatisasi pembuatan tagihan atau pembaruan status jaringan saat invoice lunas.

---

### 4. Struktur Database (Skema Firebase Firestore)

#### Koleksi: `users`
Menyimpan profil pengguna dan informasi akun.
| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `uid` | String | Primary Key (dihasilkan oleh Firebase Auth) |
| `name` | String | Nama lengkap pengguna |
| `email` | String | Alamat email terdaftar |
| `role` | String | Hak akses: `"admin"` atau `"customer"` |
| `planId` | String | Referensi ke ID paket internet di koleksi `plans` |
| `status` | String | Status akun: `"active"` atau `"suspended"` |

#### Koleksi: `plans`
Menyimpan daftar paket layanan WiFi yang ditawarkan.
| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `planId` | String | ID Unik Paket (Auto-generated) |
| `name` | String | Nama Paket (misal: "Paket Home 20Mbps") |
| `speed` | Number | Kecepatan dalam Mbps |
| `price` | Number | Harga paket bulanan |

#### Koleksi: `invoices`
Menyimpan data catatan tagihan bulanan pelanggan.
| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `invoiceId` | String | ID Unik Tagihan (Auto-generated) |
| `userId` | String | ID Pengguna yang ditagih (merujuk ke `users.uid`) |
| `amount` | Number | Total nominal yang harus dibayar |
| `billingMonth`| Timestamp | Periode bulan tagihan |
| `dueDate` | Timestamp | Batas akhir pembayaran |
| `status` | String | Status pembayaran: `"paid"`, `"unpaid"`, atau `"overdue"` |

---

### 5. Metrik Kesuksesan (Success Metrics)
* **Performa Cepat:** Landing page ringan dengan optimasi Next.js Image.
* **Keamanan Terjamin:** Halaman admin terlindungi sepenuhnya secara *server-side* dan *client-side* melalui Firebase Auth token.
* **Sinkronisasi Real-time:** Status tagihan langsung berubah di sisi User segera setelah Admin memperbarui data di Firestore.
# Fresh+ — Demo ERP

Demo interaktif HTML, CSS, dan JavaScript murni. Tidak perlu Node.js, database, npm install, atau build. Seluruh nama, kontak, dan transaksi merupakan contoh fiktif.

## Coba di komputer

Buka `index.html` langsung di browser. Navigasi, pencarian, filter, tambah/edit produk dan pelanggan, quotation, invoice, surat jalan, pembayaran, serta cetak/PDF bisa dicoba.

Perubahan tersimpan di browser yang sama menggunakan localStorage. Jika penyimpanan browser dinonaktifkan, perubahan hanya bertahan selama halaman terbuka. Tombol **Reset demo** mengembalikan data contoh. Setiap pengunjung memiliki datanya sendiri; demo ini bukan aplikasi produksi.

## Upload ke GitHub Pages

1. Buat repository GitHub, misalnya `freshplus-demo`.
2. Upload **seluruh isi folder demo ini** ke root repository, termasuk `inventory.js`, `about.html`, dan `about.css`.
3. Di repository, buka **Settings → Pages**.
4. Pilih **Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
5. Setelah deploy selesai, buka URL yang ditampilkan GitHub Pages dan bagikan ke user.

Semua path aset relatif, sehingga bisa dipakai pada URL repository GitHub Pages. Font Google bersifat opsional; font sistem tetap tersedia jika offline. Tidak ada API, aset gambar remote, atau kunci rahasia.

Upload folder demo saja; aplikasi utama dan database SQLite tidak diperlukan. Fitur demo: dashboard berisi transaksi contoh, katalog, produk/pricelist, pelanggan, quotation → invoice/surat jalan, pembayaran sebagian/lunas, kas, export JSON, dan cetak dokumen.

## Klien, vendor, dan pergerakan barang

Daftar klien memakai data pelanggan yang sudah ada. Modul vendor menyimpan kategori pasokan, kontak, dan alamat. Barang masuk/keluar mencatat tanggal dan jam WIB, produk, jumlah, mitra, alasan, serta referensi. Stok dihitung per produk dan satuan. Transaksi keluar ditolak jika menyebabkan stok negatif. Penjualan, barang rusak/susut, dan pemakaian internal dicatat dengan alasan berbeda.

Invoice dan surat jalan tidak mengubah stok otomatis. Catat pergerakan saat barang secara fisik masuk/keluar agar tidak terhitung ganda. Catatan barang tidak otomatis membuat transaksi kas. Riwayat yang sudah disimpan belum dapat diedit/dibatalkan pada demo ini.

Pengunjung lama tetap memiliki data percobaannya; modul vendor ditambahkan dan riwayat stok dimulai kosong. Gunakan Reset demo untuk melihat contoh lengkap penerimaan dan pengeluaran. Data baru meliputi 4 vendor dan contoh stok untuk 12 produk.

Tombol **Mengenal aplikasi** membuka `about.html`, berisi fungsi aplikasi, alur operasional, teknologi demo, arah versi operasional JavaScript/Node.js + SQLite, serta opsi pengembangan. Seluruh fitur baru pada pembaruan ini berada di folder demo; backend aplikasi utama belum diperluas dengan modul vendor/stok.
